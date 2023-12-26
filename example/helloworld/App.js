import { h } from "../../lib/guide-mini-vue.esm.js"

window.sefl = null
export const App = {


    render() {
        window.self = this
        return h("div",{
            id: "root",
            class: ["red", "hard"]
        }, 
        this.msg
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