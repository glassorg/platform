import { describe, expect, test } from 'vitest'
import { randomNumberGenerator } from "../functions.js"

describe("randomNumberGenerator", () => {
    test("randomNumberGenerator", () => {
        let random = randomNumberGenerator()
        for (let i = 0; i < 100; i++)
            console.log(random())
    })
});
