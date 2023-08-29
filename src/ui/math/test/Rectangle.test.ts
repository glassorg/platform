import { describe, expect, test } from 'vitest'
import Vector3 from "../Vector3.js"
import Capsule from "../Capsule.js"
import Sphere from "../Sphere.js"
import Rectangle from "../Rectangle.js"

describe("Rectangle", () => {
    test("intersects capsule", assert => {

        let rect = new Rectangle(0, 0, 195, 195)
        let capsule = new Capsule(
            new Sphere(new Vector3(200, 200, 0), 10),
            new Sphere(new Vector3(200, 200, 1), 10)
        )

        let result = rect.intersectsCapsule(capsule)

        rect = new Rectangle(0, 0, 185, 185)
        result = rect.intersectsCapsule(capsule)
        expect(result).to.be.null;
    })
})

