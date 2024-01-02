import { createVNode } from "./vnode"

export function createAppAPI(render) {

    return function createApp(rootComponent) {

        return {
            mount(rootContainer) {
                // 先vnode
                // component -> vnode 所有的逻辑操作都会基于vnode 处理

                const vnode = createVNode(rootComponent);

                render(vnode, rootContainer);
            }
        }
    }
}



