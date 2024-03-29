import * as GL from "./GL.js"
import Graphics3D from "./Graphics3D.js"
import Primitive from "./Primitive.js"

export enum DataType {
    Vertex = GL.ARRAY_BUFFER,
    Index = GL.ELEMENT_ARRAY_BUFFER
}

export enum BufferUsage {
    staticDraw = GL.STATIC_DRAW,
    dynamicDraw = GL.DYNAMIC_DRAW,
    streamDraw = GL.STREAM_DRAW,
}

export default abstract class DataBuffer {

    /**
     * The graphics context this is attached to.
     */
    public readonly graphics: Graphics3D
    /**
     * The mode for rendering this vertex buffer.
     */
    public readonly primitive: Primitive
    /**
     * How many elements that are currently in this buffer.
     */
    public size: number = 0
    /**
     * The intended usage for this buffer.
     * Usually STATIC_DRAW or STREAM_DRAW
     */
    public readonly usage: number
    /**
     * The underlying WebGLBuffer
     */
    protected readonly glBuffer: WebGLBuffer
    /**
     * The offset where data starts within this glBuffer.
     */
    public readonly offset: number
    /**
     * The type of data stored, either Vertex or Index data. 
     */
    public readonly type: DataType

    constructor(graphics: Graphics3D, usage: BufferUsage, type: DataType, primitive: Primitive, glBuffer = graphics.gl.createBuffer(), offset = 0) {
        this.graphics = graphics
        this.usage = usage
        this.type = type
        if (glBuffer == null)
            throw new Error("glBuffer required")
        this.glBuffer = glBuffer
        this.offset = offset
        this.primitive = primitive
    }

    abstract draw()

    bind() {
        this.graphics.gl.bindBuffer(this.type, this.glBuffer)
    }

    setData(data: Uint32Array | Uint16Array | Float32Array, length: number = data.length) {
        this.bind()
        this.graphics.gl.bufferData(this.type, data, this.usage, this.offset, length)
        this.size = length
    }

}