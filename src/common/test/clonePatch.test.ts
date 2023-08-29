import { describe, expect, test } from 'vitest'
import clonePatch from "../clonePatch.js"


class Foo {
    foo = 10
    constructor(props) {
        Object.freeze(Object.assign(this, props))
    }
}

class Bar {
    bar = 10
    constructor(props) {
        Object.freeze(Object.assign(this, props))
    }
}

describe(`clonePatch`, () => {
    test(`should create records`, async () => {
        let foo = new Foo({ x: 1, y: 2, bar: new Bar({ a: 10, b: 20 }) })
        let foo2 = clonePatch(foo, { x: 5, bar: { b: 40 } })
        expect(foo2).to.deep.equal(new Foo({ x: 5, y: 2, bar: new Bar({ a: 10, b: 40 }) }))
        expect(clonePatch(foo, null) === null).to.be.true
        expect(clonePatch(foo, {}) === foo).to.be.true
        expect(clonePatch(foo, "foo") === "foo").to.be.true
        expect(clonePatch(foo, 12) === 12).to.be.true
        expect(clonePatch(foo, false) === false).to.be.true
        expect(clonePatch([1, 2], { 2: 3 })).to.deep.equal([1, 2, 3])
        let bar = new Foo({ x: 10 })
        let bar2 = clonePatch(bar, { x: null })
        expect(bar2).to.deep.equal(new Foo({}))
        // make sure a delete value command like bar: null can't slip through into value
        expect(clonePatch({}, { foo: { bar: null } })).to.deep.equal({ foo: {} })
    });
});
