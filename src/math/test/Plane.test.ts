import { describe, expect, test } from 'vitest'
import Vector3 from "../Vector3.js"
import Plane from "../Plane.js"
import Capsule from "../Capsule.js"
import Sphere from "../Sphere.js"
import Line from "../Line.js"

describe(`Plane`, () => {
    test(`intersection`, async () => {
        let plane = new Plane(new Vector3(1, 1, 1), 0)
        expect(
            plane.intersects(
                new Sphere(
                    new Vector3(1, 1, 1),
                    Math.hypot(1, 1, 1) + 0.01
                )
            )
        ).to.be.true;
        expect(
            plane.intersects(
                new Sphere(
                    new Vector3(1, 1, 1),
                    Math.hypot(1, 1, 1) - 0.01
                )
            )
        ).to.be.false;
        let capsuleFunc = (epsilon: any) =>
            new Capsule(
                new Sphere(
                    new Vector3(100, 100, 100),
                    0.5
                ),
                new Sphere(
                    new Vector3(2, 2, 2),
                    Math.hypot(2, 2, 2) + epsilon
                )
            )
        expect(plane.intersects(capsuleFunc(0.01))).to.be.true;
        expect(plane.intersects(capsuleFunc(-0.01))).to.be.false;
    });

    test("closestPoint", assert => {
        let plane = new Plane(new Vector3(1, 1, 1), 0)
        let line = new Line(
            new Vector3(-1, -1, -1),
            new Vector3(1, 1, 1),
        )
        expect(plane.getClosestPoint(
            new Line(
                new Vector3(-1, -1, -1),
                new Vector3(1, 1, 1),
            )
        )).to.deep.equal(Vector3.zero);
    })
});
