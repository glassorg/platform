import { createTexture } from "./functions.js"
import TextureBase from "./TextureBase.js"
import Rectangle from "../math/Rectangle.js"
import Graphics3D from "./Graphics3D.js"
import Graphics from "./Graphics.js"

export default class Texture extends TextureBase {

    readonly id: string
    readonly gl: WebGL2RenderingContext
    readonly glTexture: WebGLTexture
    readonly width: number
    readonly height: number
    private readonly image?: HTMLImageElement

    // the default image url is a white 1x1 pixel image.
    static default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P4////fwAJ+wP9BUNFygAAAABJRU5ErkJggg=="
    static defaultUV = new Rectangle(0, 0, 1, 1)

    constructor(gl: WebGL2RenderingContext, id: string, src?: string)
    constructor(gl: WebGL2RenderingContext, id: string, glTexture: WebGLTexture, width: number, height: number)
    constructor(gl: WebGL2RenderingContext, id: string, glTextureOrSrc: string, width?: number, height?: number, callback?: () => void)
    constructor(gl: WebGL2RenderingContext, id: string, glTextureOrSrc: WebGLTexture | string = id, width?: number, height?: number, callback?: () => void) {
        super()
        this.id = id
        this.gl = gl
        let dynamic = typeof glTextureOrSrc === "string" && id !== glTextureOrSrc
        if (typeof glTextureOrSrc == "string") {
            this.width = 1
            this.height = 1
            this.glTexture = createTexture(gl, glTextureOrSrc, (image) => {
                let self = this as any
                if (dynamic) {
                    self.image = image
                }
                self.width = image.width;
                self.height = image.height;
                callback?.()
            })
        }
        else {
            this.glTexture = glTextureOrSrc
            this.width = width!
            this.height = height!
        }
    }

    update(dataUrl: string, onload?: (image: HTMLImageElement) => void) {
        if (this.image == null) {
            throw new Error("Only dynamic textures can be updated")
        }
        if (this.image != null) {
            this.image.onload = () => {
                let { gl } = this
                gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image!)
                if (onload) {
                    onload(this.image!)
                }
            }
            this.image.src = dataUrl
        }
    }

    /**
     * Gets the left UV coordinate.
     */
    get left() { return 0 }
    /**
     * Gets the top UV coordinate.
     */
    get top() { return 0 }
    /**
     * Gets the right UV coordinate.
     */
    get right() { return 1 }
    /**
     * Gets the bottom UV coordinate.
     */
    get bottom() { return 1 }

    /**
     * ResourceLoader interface
     */
    static load(g: Graphics, id: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            if (!(g instanceof Graphics3D)) {
                throw new Error()
            }
            let texture = new Texture(g.gl, id, id, undefined, undefined, () => {
                console.log("resolving texture")
                resolve(texture)
            })
        })
    }

}