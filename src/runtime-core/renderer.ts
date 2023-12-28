import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import {setupComponent, createComponentInstance} from "./component"
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    // patch
    patch(vnode, container);

 }


 function patch(vnode, container) {
    //如何区分类型
    // handle component
    const { shapeFlag, type } = vnode;

    //Fragment -> 只渲染children
    switch(type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if(shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container);
            }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                // STATEFUL_COMPONENT
                processComponent(vnode, container);
            }
    }
 }

 function processFragment(vnode: any, container: any) {
    mountChildren(vnode.children, container);
 }

 function processText(vnode: any, container: any) {
    const {children} = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode)
 }

 function processElement(vnode, container) {
    // debugger
    mountElement(vnode, container);
 }

 function mountElement(vnode: any, container: any) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlag } = vnode
    // shapeFlags 
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
         el.textContent = children;
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(children, el);
    }
    const { props } = vnode;
    for(const key in props) {
        const val = props[key];
        const isOn = (key:string) => {
            return /^on[A-Z]/.test(key);
        }
        if(isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }else {
            el.setAttribute(key, val);
        }
    }
    // el.setAttribute("id", "root");
    container.append(el);
 }

 function mountChildren(vnode, container) {
    vnode.forEach((v) => {
        console.log("====vnode", v)
        patch(v, container);
    })
 }

 function processComponent(vnode: any, container) {

    mountComponent(vnode, container);
 }

 function mountComponent(vnode: any, container: any) {
    const instance = createComponentInstance(vnode);

    setupComponent(instance)
    setupRenderEffect(instance,vnode, container);
 }

 function setupRenderEffect(instance: any,vnode,  container: any) {
    // const subTree = instance.render();
    const { proxy } = instance;
    const subTree = instance.render.call(proxy)
    patch(subTree, container)

    vnode.el = subTree.el
 }