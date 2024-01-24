import { NodeTypes } from "./ast";

const enum TagType {
    Start,
    End,
}

export function baseParse(content: string) {
    const context = createParserContenxt(content)
    return createRoot(parseChildren(context, []))

}

function parseChildren(context, ancestors) {
    console.log("parseChildren", context, ancestors)
    const nodes: unknown[] = [];
    while (!isEnd(context, ancestors)) {
        const s = context.source
        console.log("start parse context", context, s[1])

        let node;
        if (s.startsWith("{{")) {
            node = parseInterpolation(context);
        } else if (s[0] === "<") {
            if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors);
            }
        }

        if (!node) {
            node = parseText(context);
        }
        nodes.push(node);
    }
    return nodes
}

function isEnd(context, ancestors) {
    const s = context.source;
    console.log("isEnd", s)
    if (s.startsWith("</")) {
        for (let i = 0; i < ancestors.length; i++) {
            const tag = ancestors[i].tag;
            if (startsWithEndTagOpen(s, tag)) {
                return true
            }
        }
    }
    // if(parentTag && s.startsWith(`</${parentTag}>`)) {
    //     return true
    // }
    return !s;
}

function parseText(context: any) {
    let endIndex = context.source.length;
    let endTokens = ["<", "{{"];

    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i]);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }
    const content = parseTextData(context, endIndex);
    return {
        type: NodeTypes.TEXT,
        content
    }
}

function parseTextData(context: any, length) {
    const content = context.source.slice(0, length);
    advanceBy(context, length)
    return content
}

function parseElement(context: any, ancestors) {

    const element: any = parseTag(context, TagType.Start);
    ancestors.push(element)
    element.children = parseChildren(context, ancestors);
    ancestors.pop();
    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagType.End);
    } else {
        throw new Error("lack tag")
    }

    return element;
}

function startsWithEndTagOpen (source, tag) {
    return source.startsWith("</") && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}

function parseTag(context, type: TagType) {
    const match: any = /^<\/?([a-z]*)/i.exec(context.source);
    console.log("=====match", match, context, type)
    const tag = match[1];
    advanceBy(context, match[0].length)
    advanceBy(context, 1)
    console.log("after parse", context)
    if (type === TagType.End) return;
    return {
        type: NodeTypes.ELEMENT,
        tag: tag,
    }
}

function parseInterpolation(context) {
    // {{message}}
    const openDelimiter = "{{"
    const closeDelimiter = "}}"
    const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);
    advanceBy(context, openDelimiter.length);

    const rawContentLength = closeIndex - openDelimiter.length;
    console.log("befor parse text", context)
    const rawContent = parseTextData(context, rawContentLength);
    const content = rawContent.trim();
    advanceBy(context, closeDelimiter.length);

    console.log("context.source", context.source);
    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content,
        }
    }
}

function advanceBy(context: any, length: number) {
    context.source = context.source.slice(length)
}

function createRoot(children) {
    return {
        children,
        type: NodeTypes.ROOT
    }
}

function createParserContenxt(content: string): any {
    return {
        source: content
    }
}