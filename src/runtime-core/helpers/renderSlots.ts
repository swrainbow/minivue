import { Fragment, createVNode } from "../vnode";

export function renderSlots(slots, name, props) {
    const slot = slots[name];

    if(slot) {
        //function
        if(typeof slot === 'function') {
            // console.log("createVNode", createVNode("div", {}, slot))
            const vnode = createVNode(Fragment, {}, slot(props))
            return vnode
        }
    }
}