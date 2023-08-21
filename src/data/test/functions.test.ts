import { describe, expect, test } from 'vitest'
import { clone, isAlreadySorted, mergePatch, normalizeKeyOrder } from '../functions.js';

describe(`clone`, () => {
    test(`should copy objects`, async () => {
        let before = { a: 1, b: 2 };
        let after = clone(before);
        expect(before).to.not.equal(after);
    })
    test(`should copy arrays`, async () => {
        let before = [1, 2];
        let after = clone(before);
        expect(before).to.not.equal(after);
    })
});

describe(`mergePatch`, () => {
    test(`should return null on null patch`, async () => {
        expect(mergePatch({ a: 1 }, null)).to.be.equal(null);
    })
    test(`should not change object on no-op patch`, async () => {
        let before = { a: 1 }
        expect(mergePatch(before, { a: 1 })).to.be.equal(before);
    })
    test(`should not change object undefined`, async () => {
        let before = { a: 1 }
        expect(mergePatch(before, undefined)).to.be.equal(before);
    })
});

describe(`isAlreadySorted`, () => {
    test(`should return true if sorted`, async () => {
        expect(isAlreadySorted([1, 2, 3])).to.be.true;
        expect(isAlreadySorted([1, 2, 2, 2, 3])).to.be.true;
        expect(isAlreadySorted(["a", "b", "c"])).to.be.true;
    })
    test(`should return false if not sorted`, async () => {
        expect(isAlreadySorted([1, 2, 3, 1])).to.be.false;
        expect(isAlreadySorted(["d", "b", "c"])).to.be.false;
    })
});

describe(`normalize`, () => {
    test(`should return normalized keys`, async () => {
        expect(normalizeKeyOrder({ a: 1, c: 2, b: 3 })).to.deep.equal({ a: 1, b: 3, c: 2 });
    })
    test(`should return same object if already normalized`, async () => {
        let before = { a: 1, b: 2, c: 3 };
        expect(normalizeKeyOrder(before)).to.equal(before);
    })
});
