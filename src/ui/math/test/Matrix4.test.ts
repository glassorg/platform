import { describe, expect, test } from 'vitest'
import Matrix4 from "../Matrix4.js"
import Vector3 from "../Vector3.js"

describe(`Matrix4`, () => {
    test("Matrix4", assert => {
        let transform = Matrix4.transformation(
            new Vector3(10, 20, 5),
            new Vector3(2, 3, 2),
            new Vector3(1, 1, 1), Math.PI / 2
        )
        let a = new Vector3(1, 2, 3)
        let b = a.transform(transform)
        let inverse = transform.inverse()
        let c = b.transform(inverse)

        expect(a.equivalent(b)).to.be.false
        expect(a.equivalent(c)).to.be.true
    });

    test("Matrix4 / Vector Associativity", () => {
        let x = new Vector3(1, 0, 0)
        let y = new Vector3(0, 1, 0)
        let z = new Vector3(0, 0, 1)
        let roty = Matrix4.rotation(y, Math.PI / 2)
        let rotz = Matrix4.rotation(z, Math.PI / 2)
        let xPrime = x.transform(roty).transform(rotz) // = Rz (Ry x)
        let xPrime2 = x.transform(rotz.multiply(roty)) // = (Rz Ry) x
        let xPrime3 = x.transform(roty.multiply(rotz)) // = (Ry Rz) x

        expect(xPrime.equivalent(xPrime2)).to.be.true
        expect(xPrime3.equivalent(xPrime2)).to.be.false
    });
});
