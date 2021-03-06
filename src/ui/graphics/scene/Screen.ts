import Graphics from "../Graphics"
import Color from "../../math/Color"
import Control from "./Control"
import Graphics3D from "../Graphics3D"
import Matrix4 from "../../math/Matrix4"
import Dock from "./Dock"
import Program from "../Program"

export default class Screen extends Control {

    width = window.outerWidth
    height = window.outerHeight
    backgroundColor = Color.transparent
    depth = 1
    layout = Dock.fill

    constructor() {
        super()
        this.effect = Program.default2D
    }

    draw(g: Graphics) {
        g.clear(this.backgroundColor, this.depth)

        if (g instanceof Graphics3D) {
            //  we always initialize a screen to a 2d pixel based projection
            //  with top-left origin
            g.uniforms.projection = new Matrix4(
                2 / this.width, 0, 0, 0,
                0, -2 / this.height, 0, 0,
                0, 0, -1, 0,
                -1, 1, 0, 1
            )
        }

        super.draw(g)
    }

}
