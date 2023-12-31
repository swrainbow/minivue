
import { createRenderer } from '../runtime-core'

function createElement(type) {
    console.log("createElement------------")
    return document.createElement(type)
}

function patchProp(el, key, preVal, nextVal) {
    console.log("patchProp------------")

    const isOn = (key: string) => {
        return /^on[A-Z]/.test(key);
    }
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    } else {
        if(nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }else {
            el.setAttribute(key, nextVal);
        }
    }
}

function insert(el, parent) {
    console.log("insert------------")

    parent.append(el);
}

function remove(child) {
    const parent = child.parentNode;
    if(parent) {
        parent.removeChild(child);
    }
}

function setElementText(el, text) {
    el.textContent = text;
}


const renderer: any = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
})

export function createApp(...args) {
    return renderer.createApp(...args)
}

export * from "../runtime-core";
