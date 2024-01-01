import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import {setupComponent, createComponentInstance} from "./component"
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    // patch
    patch(vnode, container);

 }


 function patch(vnode, container, parentComponent = null) {
    //如何区分类型
    // handle component
    const { shapeFlag, type } = vnode;

    //Fragment -> 只渲染children
    switch(type) {
        case Fragment:
            processFragment(vnode, container, parentComponent);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if(shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container, parentComponent);
            }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                // STATEFUL_COMPONENT
                processComponent(vnode, container, parentComponent);
            }
    }
 }

 function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode.children, container, parentComponent);
 }

 function processText(vnode: any, container: any) {
    const {children} = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode)
 }

 function processElement(vnode, container, parentComponent) {
    // debugger
    mountElement(vnode, container, parentComponent);
 }

 function mountElement(vnode: any, container: any,  parentComponent) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlag } = vnode
    // shapeFlags 
    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
         el.textContent = children;
    }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(children, el, parentComponent);
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

 function mountChildren(vnode, container, parentComponent) {
    vnode.forEach((v) => {
        console.log("====vnode", v)
        patch(v, container, parentComponent);
    })
 }

 function processComponent(vnode: any, container, parentComponent) {

    mountComponent(vnode, container, parentComponent);
 }

 function mountComponent(vnode: any, container: any, parentComponent) {
    const instance = createComponentInstance(vnode, parentComponent);

    setupComponent(instance)
    setupRenderEffect(instance,vnode, container);
 }

 function setupRenderEffect(instance: any,vnode,  container: any) {
    // const subTree = instance.render();
    const { proxy } = instance;
    const subTree = instance.render.call(proxy)
    patch(subTree, container, instance)

    vnode.el = subTree.el
 }