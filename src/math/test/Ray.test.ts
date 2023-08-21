import { describe, expect, test } from 'vitest'
import Ray from "../Ray.js"
import Vector3 from "../Vector3.js"
import Sphere from "../Sphere.js"
import { equivalent } from "../functions.js"
import AABB from "../AABB.js"

describe("Ray", () => {
    test("Cast on Sphere", assert => {
        let r = new Ray(new Vector3(0, Math.sin(Math.PI / 4), 0), new Vector3(1, 0, 0))
        let s = new Sphere(new Vector3(1, 0, 0), 1)
        let d = s.raycastDistance(r)
        expect(d).to.not.equal(null);
        expect(
            equivalent(
                (1 - d!),
                Math.sqrt(2) / 2
            )
        ).to.be.true;
    })
    test("Cast on AABB", assert => {
        let r = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
        let box = new AABB(new Vector3(0, 10, 0), new Vector3(1, 1, 1))
        let hit = box.raycast(r)
        expect(hit).to.not.equal(null);
        let normal = box.normal(hit!)
        expect({ hit, normal }).to.deep.equal(
            {
                hit: new Vector3(0, 9, 0),
                normal: new Vector3(0, -1, 0)
            }
        );
    })
})

