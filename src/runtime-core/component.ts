
import { proxyRefs } from '../reactivity';
import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots';
export function createComponentInstance(vnode, parent) {
    console.log('createComponentInstance',parent)
    const component = {
        vnode,
        type: vnode.type,
        next: null,
        props: {},
        slots: {},
        setupState: {},
        emit: ()=>{},
        isMounted: false,
        subTree: {},
        provides: parent ? parent.provides : {} ,
        parent,
    }
    component.emit = emit.bind(null, component) as any;
    return component
}

export function setupComponent(instance) {
    // initProps
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
    console.log("instance", instance)
    const Component = instance.type;

    instance.proxy = new Proxy(
        { _: instance }, 
            PublicInstanceProxyHandlers)

    const {setup} = Component;

    if(setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        // const setupResult = setup(instance.props);

        currentInstance = null;
        handleSetupResult(instance, setupResult);
    }

}


function handleSetupResult(instance, setupResult: any) {

    if(typeof setupResult === 'object') {
        instance.setupState = proxyRefs(setupResult)
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type
    if(compiler && !Component.render) {
        if(Component.template) {
            Component.render = compiler(Component.template);
        }
    }
    if(Component.render) {
        instance.render = Component.render;
    }
}

let currentInstance = null;
export function getCurrentInstance() {
    return currentInstance;
}

export function setCurrentInstance(instance) {
    currentInstance = instance
}

let compiler;

export function registerRuntimeCompiler(_compiler) {
    compiler = _compiler;
}
