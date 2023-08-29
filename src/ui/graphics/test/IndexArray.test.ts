import { describe, expect, test } from 'vitest'
import * as GL from "../GL.js"
import IndexArray from "../IndexArray.js"

describe("IndexArray", () => {
    test("IndexArray reading and writing", assert => {
        for (const type of [GL.UNSIGNED_INT, GL.UNSIGNED_SHORT]) {
            const array = new IndexArray(1, type)
            expect(array.type).to.deep.equal(type);
            expect(array.length).to.deep.equal(0);
            expect(array.capacity).to.deep.equal(1);
            array.set(0, 12);
            expect(array.get(0)).to.deep.equal(12);
            expect(array.toArray()).to.deep.equal([12]);

            array.set(1, 69);
            expect(array.length).to.deep.equal(2);
            expect(array.capacity >= 2).to.be.true;
            const expected = [12, 69];
            expect(array.toArray()).to.deep.equal(expected);

            // change expected slightly then set it and verify
            expected[0] = 21;
            array.setData(expected);
            expect(array.capacity).to.deep.equal(2);
            expect(array.toArray()).to.deep.equal(expected);
        }
    })

});