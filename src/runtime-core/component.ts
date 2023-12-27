
import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlots';
export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        props: {},
        slots: {},
        setupState: {},
        emit: ()=>{}
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
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        // const setupResult = setup(instance.props);


        handleSetupResult(instance, setupResult);
    }

}


function handleSetupResult(instance, setupResult: any) {

    if(typeof setupResult === 'object') {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type

    if(Component.render) {
        instance.render = Component.render;
    }
}