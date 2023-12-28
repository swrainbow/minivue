import { h , createTextVNode} from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
window.sefl = null
export const App = {

    name: "App",
    render() {
        const app = h("div", {}, "App");
        const foo = h(Foo, {}, {
            header:({age}) => [h("p", {}, "header" + age),
            createTextVNode("你好呀")
        ], 
            footer:() => h("p", {}, "foot"),
        });

        return h("div", {}, [app, foo]);

    },

    setup() {
        // composition api

        return {
            
        }
    }
};