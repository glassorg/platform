import SceneNode from "./SceneNode.js"
import Graphics3D from "../Graphics3D.js"
import GLTFModel from "../GLTFModel.js"

export default class GLTFInstance extends SceneNode {

    source!: string

    draw(g: Graphics3D) {

        let model = g.resource<GLTFModel>(GLTFModel, this.source, this)
        if (model) {
            g.program = model.program
            for (let mesh of model.meshPrimitives) {
                for (let primitive of mesh) {
                    primitive.draw()
                }
            }
        }

        super.draw(g)
    }

}
