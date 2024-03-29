import * as GL from "./GL.js"

//  we can promote this enum later to smart objects which help draw the right amount
enum Primitive {
    triangles = GL.TRIANGLES,
    points = GL.POINTS,
    lines = GL.LINES,
    models = -1
}

export default Primitive

