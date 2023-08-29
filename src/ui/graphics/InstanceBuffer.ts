import VertexFormat from "./VertexFormat.js"
import Graphics3D from "./Graphics3D.js"
import DataBuffer, { BufferUsage } from "./DataBuffer.js"
import Primitive from "./Primitive.js"
import VertexBuffer from "./VertexBuffer.js"
import IndexBuffer from "./IndexBuffer.js"
import * as GL from "./GL.js"

export default class InstanceBuffer extends VertexBuffer {

    instance: DataBuffer

    constructor(graphics: Graphics3D, usage: BufferUsage, vertexFormat: VertexFormat, instance: IndexBuffer) {
        super(graphics, usage, vertexFormat, Primitive.models)
        this.instance = instance
    }

    /**
     * Used for instanced rendering.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/vertexAttribDivisor
     */
    get vertexDivisor() {
        return 1
    }

    draw() {
        if (this.size > 0) {
            if (!(this.instance instanceof IndexBuffer)) {
                throw new Error("Not supported yet or probably ever")
            }
            else {
                let vertices = this.instance.vertices
                this.graphics.bindAttributes([...vertices, this])
                this.graphics.bindUniforms()
                let vertexCount = this.instance.size
                let instanceCount = this.size / this.vertexFormat.components
                this.instance.bind()
                this.graphics.gl.drawElementsInstanced(vertices[0].primitive, vertexCount, GL.UNSIGNED_SHORT, 0, instanceCount)
            }
        }
    }

}