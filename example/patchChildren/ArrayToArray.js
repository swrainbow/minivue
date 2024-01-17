import { h , ref} from "../../lib/guide-mini-vue.esm.js";

// const prevChildren = [
//     h("p", {key: "A"}, "A"),
//     h("p", {key: "B"}, "B"),
//     h("p", {key: "C"}, "C"),
//     h("p", {key: "D"}, "D"),
//     h("p", {key: "E"}, "E"),
//     h("p", {key: "Z"}, "Z"),
//     h("p", {key: "F"}, "F"),
//     h("p", {key: "G"}, "G"),
// ];

// const nextChildren = [
//     h("p", {key: "A"}, "A"),
//     h("p", {key: "B"}, "B"),
//     h("p", {key: "D"}, "D"),
//     h("p", {key: "C"}, "C"),
//     h("p", {key: "Y"}, "Y"),
//     h("p", {key: "E"}, "E"),
//     h("p", {key: "F"}, "F"),
//     h("p", {key: "G"}, "G"),
// ];

const prevChildren = [
    h("p", {key: "A"}, "A"),
    h("p", {}, "C"),
    h("p", {key: "B"}, "B"),
    h("p", {key: "D"}, "D"),
];

const nextChildren = [
    h("p", {key: "A"}, "A"),
    h("p", {key: "B"}, "B"),
    h("p", {}, "C"),
    h("p", {key: "D"}, "D"),
];
export default {
    name: "ArrayToText",
    setup() {
        const isChange = ref(false);
        window.isChange = isChange;

        return {
            isChange,
        };
    },
    render() {
        const self = this;

        return self.isChange === true ? h("div", {}, nextChildren) : h("div", {}, prevChildren);
    }
}