import DataBuffer from "./DataBuffer.js"
import VertexStream from "./VertexStream.js"
import InstanceBuffer from "./InstanceBuffer.js"
import IndexBuffer from "./IndexBuffer.js"

const sizeOfFloat = 4

export default class InstanceStream extends VertexStream {

    public readonly buffer!: InstanceBuffer

    constructor(buffer: InstanceBuffer, count = 64 * 1024) {
        super(buffer, count)
    }

    writeInstance(instance: DataBuffer, components: number[])
    writeInstance(instance: DataBuffer, ...components: number[])
    writeInstance(instance: DataBuffer) {
        if (!(instance instanceof IndexBuffer)) {
            throw new Error("Not supported yet")
        }
        if (this.buffer.instance !== instance) {
            this.flush()
            this.buffer.instance = instance
        }
        const components = typeof arguments[1] === "number" ? Array.prototype.slice.call(arguments, 1) : arguments[1]
        this.write(components)
    }

}