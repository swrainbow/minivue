import { isTracking, trackEffects, triggerEffects } from "./effect";
import { hasChanged , isObject} from '../shared/index'
import { reactive } from './reactive'


class RefImpl{
    private _value: any;
    private _rawValue: any
    private __v_isRef = true;
    public dep
    constructor(value) {
        this._rawValue = value
        this._value = convert(value )
        // value -> reactive
        this.dep = new Set();
    }

    get value() {
        trackRefValue(this)
        return this._value
    }
 
    set value(newValue) {
        if(hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue
            this._value = convert(newValue)
            triggerEffects(this.dep)
        }

    }
}

function convert(value) {
    return isObject(value) ? reactive(value) :value;
}

function trackRefValue(ref) {
    if(isTracking()) {
        trackEffects(ref.dep)
    }
}

export function ref(value) {
    return new RefImpl(value);
}

export function isRef(ref) {
    return !!ref.__v_isRef;
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
    // get set
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },

        set(target, key, value) {
            if(isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            }else {
                return Reflect.set(target, key, value);
            }
        }
    })
}