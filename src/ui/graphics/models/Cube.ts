import Graphics3D from "../Graphics3D.js"
import IndexBuffer from "../IndexBuffer.js"
import { BufferUsage } from "../DataBuffer.js"
import VertexFormat from "../VertexFormat.js"
import Primitive from "../Primitive.js"
import IndexStream from "../IndexStream.js"
import Matrix4 from "../../math/Matrix4.js"
import Vector3 from "../../math/Vector3.js"

/**
 * Returns a unit cube with position/normal vertices. Each side is length = 1.
 */
export default function Cube(g: Graphics3D) {
    //  the IndexBuffer will store our indexed geometry
    let indexBuffer = new IndexBuffer(g, BufferUsage.staticDraw, VertexFormat.positionNormal, Primitive.triangles)
    //  we will use the IndexStream to make loading the buffer easier
    let indexStream = new IndexStream(indexBuffer)
    function addFace(normal, axis, angle) {
        const scale = 0.5
        const matrix = (axis && angle) ? Matrix4.rotation(axis, angle) : Matrix4.identity
        const transform = (...vector) => new Vector3(...vector).transform(matrix).toArray().map(value => Math.round(value) * scale)
        let a = transform(-1, +1, +1)
        let b = transform(+1, +1, +1)
        let c = transform(-1, -1, +1)
        let d = transform(+1, -1, +1)
        indexStream.writeQuads([
            ...b, ...normal,
            ...a, ...normal,
            ...d, ...normal,
            ...c, ...normal,
        ])
    }
    addFace([0, 0, 1], null, null)                             //  +z
    addFace([1, 0, 0], new Vector3(0, 1, 0), Math.PI * 0.5)    //  +x
    addFace([0, 0, -1], new Vector3(0, 1, 0), Math.PI * 1.0)    //  -z
    addFace([-1, 0, 0], new Vector3(0, 1, 0), Math.PI * 1.5)    //  -x
    addFace([0, 1, 0], new Vector3(1, 0, 0), Math.PI * 0.5)    //  +y
    addFace([0, -1, 0], new Vector3(1, 0, 0), Math.PI * 1.5)    //  -y
    //  don't forget to flush the data to the buffer
    indexStream.flush()
    return indexBuffer
}