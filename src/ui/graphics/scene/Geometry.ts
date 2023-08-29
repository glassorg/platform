import Node from "./Node.js"
import Graphics3D from "../Graphics3D.js"
import DataBuffer from "../DataBuffer.js"

export default class Geometry extends Node {

    buffer!: DataBuffer
    load?: (g: Graphics3D) => DataBuffer
    instance?: number[]

    draw(g: Graphics3D) {
        if (this.buffer == null) {
            if (this.load == null) {
                throw new Error("You must specify either buffer or load property")
            }
            this.buffer = g.getDataBuffer(this.load)
        }

        if (this.instance) {
            g.instanceStream.writeInstance(this.buffer, this.instance)
        }
        else {
            this.buffer.draw()
        }

        super.draw(g)
    }

}
