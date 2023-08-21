import { describe, expect, test } from 'vitest'
import Color from "../Color.js"

describe(`Color`, () => {
    test(`should create records`, async () => {
        let red = Color.red.toInt32()
        expect(red).to.equal(0xFF0000FF);
    });
});
