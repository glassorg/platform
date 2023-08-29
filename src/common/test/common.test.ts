import { describe, expect, test } from 'vitest'
import * as common from "../functions.js"

let count = 0

const double = common.memoize(
    function (value) {
        count++
        return value * 2
    }
)

describe("common", () => {
    test("memoize", () => {
        count = 0
        expect(2 === double(1)).to.be.true
        expect(2 === double(1)).to.be.true
        expect(2 === double(1)).to.be.true
        expect(6 === double(3)).to.be.true
        expect(6 === double(3)).to.be.true
        expect(6 === double(3)).to.be.true
        expect(count === 2).to.be.true
    })

    test("getPath", () => {
        let ancestor = [
            { x: { a: 12 } },
            { y: { b: 20 } }
        ]
        expect(["0", "x", "a"]).to.deep.equal(common.getPath(ancestor, 12));
        expect(["1", "y", "b"]).to.deep.equal(common.getPath(ancestor, 20));
        expect(["0"]).to.deep.equal(common.getPath(ancestor, ancestor[0]));
        expect([]).to.deep.equal(common.getPath(ancestor, ancestor));
    })
})
