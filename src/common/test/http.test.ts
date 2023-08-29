import { describe, expect, test } from 'vitest'
import http, { getRelativeUrl } from "../http.js"

describe("http", () => {
    test("getRelativeUrl", assert => {
        expect(getRelativeUrl("/foo/bar", "baz")).to.deep.equal("/foo/baz");
        expect(getRelativeUrl("/foo/bar", "/baz")).to.deep.equal("/baz");
    })

    test("http", assert => {
        let inObject = { foo: "Sup?", bar: "Hi There." };
        let query = http.queryFromObject(inObject);
        let outObject = http.objectFromQuery(query);
        expect(outObject).to.deep.equal(inObject);
    })
})

