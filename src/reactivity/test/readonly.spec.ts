import { readonly , isReadonly, isProxy } from "../reactive"; 
describe("readly only", ()=> {
    it("happy path", () => {
        const original = { foo: 1, bar: {baz:2 } };
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        expect(isReadonly(wrapped.bar)).toBe(true);
        expect(isReadonly(wrapped)).toBe(true)
        expect(isProxy(wrapped)).toBe(true);

    })
    

    it('warn call set', () => {
        console.warn = jest.fn()
        const user = readonly({age:10});

        user.age = 11;
        expect(console.warn).toBeCalled();
    })

    // it("should make nestd values readonly", () => {
    //     const original = { foo: 1, bar: {baz:2 } };
    //     const wrapped = readonly(original);
    //     expect(wrapped).not.toBe(original);
    //     expect(wrapped.foo).toBe(1);
    //     expect(isReadonly(wrapped)).toBe(true)
    // })
})