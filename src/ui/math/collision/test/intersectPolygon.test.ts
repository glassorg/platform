import { describe, expect, test } from 'vitest'
import Vector3 from "../../Vector3.js"
import intersectPolygon from "../intersectPolygon.js"

describe("intersectPolygon", () => {
    test("Intersect polygon", assert => {
        let polyA = [
            new Vector3(0, 0, 0),
            new Vector3(0, 1, 0),
            new Vector3(1, 1, 0),
            new Vector3(1, 0, 0),
        ]

        let polyB = [
            new Vector3(0.5, 0.5, 0),
            new Vector3(0.5, 1.5, 0),
            new Vector3(1.5, 1.5, 0),
            new Vector3(1.5, 0.5, 0),
        ]

        let intersection = intersectPolygon(polyA, polyB)
        expect(intersection).to.deep.equal([
            new Vector3(0.5, 1, 0),
            new Vector3(1, 0.5, 0),
            new Vector3(1, 1, 0),
            new Vector3(0.5, 0.5, 0),
        ]);
    })
})
