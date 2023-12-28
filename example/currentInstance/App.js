import { h , getCurrentInstance} from "../../lib/guide-mini-vue.esm.js"
import { Foo } from "./Foo.js"
window.sefl = null
export const App = {

    name: "App",
    render() {

        return h("div", {}, [h("p", {}, "currentInstance demo"), h(Foo)]);

    },

    setup() {
        // composition api
        const instance = getCurrentInstance();
        console.log("App:", instance)
    }
};