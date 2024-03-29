import Graphics3D from "../Graphics3D.js"
import VertexFormat from "../VertexFormat.js"
import Vector3 from "../../math/Vector3.js"
import Mesh from "../meshes/Mesh.js"
import VertexArray from "../VertexArray.js"
import IndexArray from "../IndexArray.js"
import { memoize } from "../../../common/functions.js"

export function createSphereMesh() {

    //  algorithm adapted from https://wiki.mcneel.com/developer/scriptsamples/icosahedron
    //  we need to add the icosohedron vertices.
    //  lets make it a unit sphere.
    const radius = 1.0
    const sqr5 = Math.sqrt(5.0)
    const phi = (1.0 + sqr5) / 2.0
    const ratio = Math.sqrt(10.0 + 2 * sqr5) / (4.0 * phi)
    const a = (radius / ratio) / (2.0 * 1.0)
    const b = (radius / ratio) / (2.0 * phi)
    const normal = new Vector3(1, 0, 0)
    const vertices = [
        0, b, -a, ...normal,
        b, a, 0, ...normal,
        -b, a, 0, ...normal,
        0, b, a, ...normal,
        0, -b, a, ...normal,
        -a, 0, b, ...normal,
        0, -b, -a, ...normal,
        a, 0, -b, ...normal,
        a, 0, b, ...normal,
        -a, 0, -b, ...normal,
        b, -a, 0, ...normal,
        -b, -a, 0, ...normal,
    ]
    const faces = [
        2, 1, 0,
        1, 2, 3,
        5, 4, 3,
        4, 8, 3,
        7, 6, 0,
        6, 9, 0,
        11, 10, 4,
        10, 11, 6,
        9, 5, 2,
        5, 9, 11,
        8, 7, 1,
        7, 8, 10,
        2, 5, 3,
        8, 1, 3,
        9, 2, 0,
        1, 7, 0,
        11, 9, 6,
        7, 10, 6,
        5, 11, 4,
        10, 8, 4,
    ]
    // TODO: calculate normals, make mesh.
    const mesh = new Mesh(
        new VertexArray(VertexFormat.positionNormal, 12).setData(vertices),
        new IndexArray(20).setData(faces)
    )
    return mesh
}

export default memoize(function getSphereFactory(detail = 0) {

    return function createSphere(g: Graphics3D) {
        const mesh = createSphereMesh()
        mesh.subdivideAllFaces(detail)
        mesh.vertices.filter("position", Vector3, p => p.normalize())
        mesh.computeNormals()
        return mesh.createIndexBuffer(g)
    }

})

// /**
//  * Returns a unit cube with position/normal vertices. Each side is length = 1.
//  */
// export default function Sphere(g: Graphics3D) {
//     //  the IndexBuffer will store our indexed geometry
//     let indexBuffer = new IndexBuffer(g, BufferUsage.staticDraw, VertexFormat.positionNormal, Primitive.triangles)
//     //  we will use the IndexStream to make loading the buffer easier
//     let indexStream = new IndexStream(indexBuffer)
//     function addFace(normal, axis, angle) {
//         const scale = 0.5
//         const matrix = (axis && angle) ? Matrix4.rotation(axis, angle) : Matrix4.identity
//         const transform = (...vector) => ...vector).transform(matrix.toArray().map(value => Math.round(value) * scale)
//         let a = transform(-1, +1, +1)
//         let b = transform(+1, +1, +1)
//         let c = transform(-1, -1, +1)
//         let d = transform(+1, -1, +1)
//         indexStream.writeQuads([
//             ...b, ...normal,
//             ...a, ...normal,
//             ...d, ...normal,
//             ...c, ...normal,
//         ])
//     }
//     addFace([ 0, 0, 1], null, null)                             //  +z
//     addFace([ 1, 0, 0], 0, 1, 0, Math.PI * 0.5)    //  +x
//     addFace([ 0, 0,-1], 0, 1, 0, Math.PI * 1.0)    //  -z
//     addFace([-1, 0, 0], 0, 1, 0, Math.PI * 1.5)    //  -x
//     addFace([ 0, 1, 0], 1, 0, 0, Math.PI * 0.5)    //  +y
//     addFace([ 0,-1, 0], 1, 0, 0, Math.PI * 1.5)    //  -y
//     //  don't forget to flush the data to the buffer
//     indexStream.flush()
//     return indexBuffer
// }