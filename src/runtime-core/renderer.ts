import { ShapeFlags } from "../shared/ShapeFlags";
import { isObject } from "../shared/index";
import { setupComponent, createComponentInstance } from "./component"
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp"
import { effect } from "../reactivity/effect";


export function createRenderer(options) {

    const {
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert
    } = options;
    console.log("options")
    function render(vnode, container) {
        // patch
        patch(null, vnode, container);

    }


    function patch(n1, n2, container, parentComponent = null) {
        //如何区分类型
        // handle component
        const { shapeFlag, type } = n2;

        //Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(n1, n2, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, parentComponent);
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    // STATEFUL_COMPONENT
                    processComponent(n1, n2, container, parentComponent);
                }
        }
    }

    function processFragment(n1, n2: any, container: any, parentComponent) {
        mountChildren(n2.children, container, parentComponent);
    }

    function processText(n1, n2: any, container: any) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode)
    }

    function processElement(n1, n2, container, parentComponent) {
        // debugger
        if(!n1) {
            mountElement(n2, container, parentComponent);
        }else {
           patchElement(n1, n2, container)
        }
    }

    function patchElement(n1, n2, container) {
        console.log("n1", n1);
        console.log("n2", n2);
    }

    function mountElement(vnode: any, container: any, parentComponent) {
        const el = (vnode.el = hostCreateElement(vnode.type));
        const { children, shapeFlag } = vnode
        // shapeFlags 
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children;
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el, parentComponent);
        }
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            // const isOn = (key:string) => {
            //     return /^on[A-Z]/.test(key);
            // }
            // if(isOn(key)) {
            //     const event = key.slice(2).toLowerCase();
            //     el.addEventListener(event, val);
            // }else {
            //     el.setAttribute(key, val);
            // }
            hostPatchProp(el, key, val);
        }
        // el.setAttribute("id", "root");
        // container.append(el);
        hostInsert(el, container);
    }

    function mountChildren(vnode, container, parentComponent) {
        vnode.forEach((v) => {
            console.log("====vnode", v)
            patch(null, v, container, parentComponent);
        })
    }

    function processComponent(n1, n2: any, container, parentComponent) {

        mountComponent(n2, container, parentComponent);
    }

    function mountComponent(vnode: any, container: any, parentComponent) {
        const instance = createComponentInstance(vnode, parentComponent);

        setupComponent(instance)
        setupRenderEffect(instance, vnode, container);
    }

    function setupRenderEffect(instance: any, vnode, container: any) {
        // const subTree = instance.render();
        effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                patch(null, subTree, container, instance)

                vnode.el = subTree.el
                instance.isMounted = true;
            } else {
                const { proxy } = instance;
                const subTree = instance.render.call(proxy)
                const prevSubTree = instance.subTree
                instance.subTree = subTree;
                console.log("update")
                patch(prevSubTree, subTree, container, instance)
            }
        })
    }

    return {
        createApp: createAppAPI(render)
    }
}