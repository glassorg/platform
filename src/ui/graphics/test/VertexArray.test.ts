import { describe, expect, test } from 'vitest'
import VertexArray from "../VertexArray.js"
import VertexFormat from "../VertexFormat.js"
import VertexElement from "../VertexElement.js"
import * as GL from "../GL.js"
import Vector3 from "../../math/Vector3.js"

describe("VertexArray", () => {
    test("VertexArray reading and writing", assert => {
        const format = new VertexFormat(
            new VertexElement("position", 3),
            new VertexElement("normal", 3),
            new VertexElement("custom", 1, GL.UNSIGNED_INT)
        );

        // start with minimal capacity
        const v = new VertexArray(format, 1);
        expect(v.capacity).to.equal(1);

        v.set(0, "position", new Vector3(1.5, 2.5, 3.5));
        v.set(0, "normal", new Vector3(1.0, 0.0, 0.0));
        v.set(0, "custom", 0xFFFFFFFF);

        expect(v.get(0, "position", Vector3)).to.deep.equal(new Vector3(1.5, 2.5, 3.5));
        expect(v.get(0, "normal", Vector3)).to.deep.equal(new Vector3(1.0, 0.0, 0.0));
        expect(v.get(0, "custom")).to.deep.equal(0xFFFFFFFF);
        expect(v.length).to.deep.equal(1);
        expect(v.toArray()).to.deep.equal([1.5, 2.5, 3.5, 1.0, 0.0, 0.0, 0xFFFFFFFF]);

        v.set(1, "position", new Vector3(2.5, 3.5, 4.5));
        v.set(1, "normal", new Vector3(0.0, 1.0, 0.0));
        v.set(1, "custom", 0xFFFFFF00);

        expect(v.get(1, "position", Vector3)).to.deep.equal(new Vector3(2.5, 3.5, 4.5));
        expect(v.get(1, "normal", Vector3)).to.deep.equal(new Vector3(0.0, 1.0, 0.0));
        expect(v.get(1, "custom")).to.deep.equal(0xFFFFFF00);
        expect(v.length).to.deep.equal(2);
        //  this ensures that we still retain earlier
        //  values even after resizing to a larger capacity
        const expected = [
            1.5, 2.5, 3.5, 1.0, 0.0, 0.0, 0xFFFFFFFF,
            2.5, 3.5, 4.5, 0.0, 1.0, 0.0, 0xFFFFFF00,
        ];
        expect(v.toArray()).to.deep.equal(expected);

        // change expected slightly then set it and verify
        expected[0] = 12.5;
        v.setData(expected);
        expect(v.capacity).to.deep.equal(2);
        expect(v.toArray()).to.deep.equal(expected);

    })
})
