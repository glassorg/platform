import Graphics from "../Graphics.js"
import Control, { ControlProps } from "./Control.js"
import Matrix4 from "../../math/Matrix4.js"
import Dock from "./Dock.js"
import Graphics3D from "../Graphics3D.js"
import { NodeName } from "../../NodeTypes.js"

export interface ViewProps extends ControlProps {
    projection?: Matrix4
}

export default class View extends Control {

    get nodeName(): NodeName { return "View" }

    projection: Matrix4 = Matrix4.identity
    layout = Dock.fill

    drawChildren(g: Graphics) {
        let saveProjection = g.uniforms.projection
        g.uniforms.projection = this.projection
        if (g instanceof Graphics3D) {
            // really we need the absolute x, y position taking ancestors into account
            g.gl.viewport(g.width - this.width + this.x, g.height - this.height - this.y, this.width, this.height)
        }
        super.drawChildren(g)
        if (g instanceof Graphics3D) {
            // restore viewport
            g.gl.viewport(0, 0, g.width, g.height)
        }

        g.uniforms.projection = saveProjection
    }

}
