import Color from "../math/Color.js"
import Matrix4 from "../math/Matrix4.js"
import ResourceManager from "./resources/ResourceManager.js"
import ResourceLoader from "./resources/ResourceLoader.js"
import Invalidatable from "./Invalidatable.js"

export default abstract class Graphics {

    // resources
    public readonly resources: ResourceManager
    // timing
    time = 0
    // properties
    abstract get width(): number
    abstract get height(): number
    // render lifecycle
    abstract begin()
    abstract end()
    // transformation
    abstract uniforms: { modelView: Matrix4, projection: Matrix4 }
    // abstract get transform(): Matrix4
    // abstract set transform(value: Matrix4)
    // drawing
    abstract clear(color?: Color, depth?: number)
    drawImage(image, x: number, y: number, width: number, height: number) {
        this.fillRectangle(x, y, width, height, Color.white, image)
    }
    abstract fillRectangle(x: number, y: number, width: number, height: number, color: Color, texture?)
    // request redraw
    abstract invalidate()

    /**
     * Shorthand for Graphics.resources.getResource(loader, id, dependent)
     */
    resource<T>(loader: ResourceLoader, id: string, dependent: Invalidatable): T | null {
        return this.resources.get(loader, id, dependent)
    }

    constructor() {
        this.resources = new ResourceManager(this)
    }

}