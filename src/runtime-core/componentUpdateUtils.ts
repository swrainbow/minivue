export function shouldUpdateComponent(prevVNode, nextVNode) {
    const {props:prevPros} = prevVNode;
    const {props:nextProps} = nextVNode;

    for(const key in nextProps) {
        if(nextProps[key] !== prevPros[key]) {
            return true;
        }
    }

    return false;
}