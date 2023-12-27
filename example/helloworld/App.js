import { h } from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
window.sefl = null
export const App = {

    name: "App",
    render() {
        window.self = this
        return h("div",{
            id: "root",
            class: ["red", "hard"],
            onClick() {
                console.log("click")
            },
            onMousedown() {
                console.log("mouse down")
            }
        }, 
        [h("div", {}, "hi, " + this.msg), h(Foo, {
            onAdd(a, b) {
                console.log("onAdd", a, b);
            },
            onAddFoo() {
                console.log("onAddFoo");
            }
        })]
        // [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
        );
    },

    setup() {
        // composition api

        return {
            msg: "mini-vue haha"
        }
    }
};