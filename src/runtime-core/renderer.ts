import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import {setupComponent, createComponentInstance} from "./component"

export function render(vnode, container) {
    // patch
    patch(vnode, container);

 }


 function patch(vnode, container) {
    //如何区分类型
    // handle component
    const { shapeFlag } = vnode;
    if(shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // STATEFUL_COMPONENT
        processComponent(vnode, container);
    }

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
        el.setAttribute(key, val);
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