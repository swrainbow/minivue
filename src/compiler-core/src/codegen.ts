import { isString } from "../../shared";
import { NodeTypes } from "./ast";
import { CREATE_ELEMENT_VNODE, TO_DISPLAY_STRING, helperMapName } from "./runtimeHelpers";

export function generate(ast) {
    const context = createCodegenContext();
    const { push } = context;

    genFunctionPreamble(ast, context);


    const functionName = "render";
    const args = ["_ctx", "_cache"];
    const signature = args.join(", ")

    push(`function ${functionName}(${signature}){`);
    push(`return `);
    console.log("genNode", ast)
    genNode(ast.codegenNode, context);
    push("}");
    return {
        code: context.code,
    }

}

function genFunctionPreamble(ast, context) {
    const { push } = context;
    const VueBinging = "Vue";
    const aliasHelper = (s) => `${helperMapName[s]}:_${helperMapName[s]}`;
    if(ast.helpers.length > 0) {
        push(`const { ${ast.helpers.map(aliasHelper).join(", ")} } = ${VueBinging}`);
    }
    push("\n");
    push("return ");
}

function genNode(node: any, context: any) {
    console.log("genNode", node, node.type === NodeTypes.ELEMENT)
    switch(node.type) {
        case NodeTypes.TEXT:
            genText(node, context);
            break;
        case NodeTypes.INTERPOLATION:
            geninterpolation(node, context);
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node, context);
            break;
        case NodeTypes.ELEMENT:
            genElement(node, context);
            break;
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompundExpression(node, context);
            break
        default:
            break;
    }
    // const { push } = context;
    // push(`'${node.content}'`)
}
function genCompundExpression(node: any, context: any) {
    const { push } = context;
    const children = node.children;
    for( let i = 0; i < children.length; i++) {
        const child = children[i];
        if(isString(child)) {
            push(child);
        }else {
            genNode(child, context);
        }
    }
}

function genElement(node, context) {
    const { push, helper} = context;
    const { tag, children , props} = node;
    console.log("genElement------", children, node, context.code);
    push(`${helper(CREATE_ELEMENT_VNODE)}( `)
    genNodeList(genNullable([tag, props, children]), context)
    // genNode(children, context);
    console.log("last===================", context.code)

    push(")")
}

function genNodeList(nodes, context) {
    const { push } = context;
    for( let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if(isString(node)) {
            push(node);
        }else {
            genNode(node, context);
        }
        if( i < nodes.length - 1) {
            push(", ")
        }
    }
}

function genNullable(args: any) {
    return args.map((arg) => arg || 'null')
}
function genExpression(node, context) {
    const { push } = context;
    push(`${node.content}`)
}

function genText(node, context) {
    const { push } = context;
    push(`'${node.content}'`);
}

function geninterpolation(node: any, context: any) {
    const { push, helper } = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(")");
}

function createCodegenContext(): any {
    const context = {
        code: "",
        push(source) {
            context.code += source;
        },
        helper(key) {
            return `_${helperMapName[key]}`
        }
    }

    return context;
}