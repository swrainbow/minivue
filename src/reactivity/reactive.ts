import { isObject } from "../shared/index";
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandler";
import { track, trigger } from "./effect";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}


export function reactive (raw) {
    return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers) 
}

export function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers) 
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}

// createActiveObject
function createReactiveObject(raw: any, baseHandlers) {
    if(!isObject(raw)) {
        console.warn(`target ${raw} must be object`)
        return raw
    }
    return new Proxy(raw, baseHandlers);
}
