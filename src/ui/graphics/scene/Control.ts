import Graphics from "../Graphics.js"
import SceneNode, { SceneNodeProps } from "./SceneNode.js"
import Color from "../../math/Color.js"
import Capsule from "../../math/Capsule.js"
import Rectangle from "../../math/Rectangle.js"
import Vector3 from "../../math/Vector3.js"
import { layout } from "./Dock.js"
import Spacing from "../../math/Spacing.js"
import Size from "../../math/Size.js"
import Pickable from "./Pickable.js"
import PickResult from "./PickResult.js"
import Matrix4 from "../../math/Matrix4.js"
import TextureBase from "../TextureBase.js"
import Graphics2D from "../Graphics2D.js"
import { NodeName } from "../../NodeTypes.js"

type LayoutFunction = (container: Control) => void

export interface ControlProps extends SceneNodeProps {
    x?: number
    y?: number
    width?: number
    height?: number
    backgroundColor?: Color
    backgroundImage?: string | TextureBase
    color?: Color
    margin?: Spacing
    padding?: Spacing
    pickRadius?: number
    minimumSize?: Size
    maximumSize?: Size
    optimumSize?: Size
    text?: string
    fontSize?: number
    size?: Size
    bounds?: Rectangle
    position?: Vector3
    layoutChildren?: LayoutFunction
    layout?: any
}

export default class Control extends SceneNode {

    private _x!: number
    private _y!: number
    width!: number
    height!: number
    backgroundColor?: Color
    backgroundImage?: string | TextureBase
    color!: Color
    margin!: Spacing
    padding!: Spacing
    pickRadius?: number
    minimumSize?: Size
    maximumSize?: Size
    optimumSize?: Size
    private transformValid?: boolean
    text?: string
    fontSize?: number
    /**
     * Layout function for positioning children.
     */
    layoutChildren: LayoutFunction = layout
    /**
     * Layout options for self.
     */
    layout?: any

    get nodeName(): NodeName { return "Control" }

    //  This assigns the values to the prototype, rather than initializing within the constructor.
    //  This is more performant AND it means we can check the prototype for default values.
    //  I do not know why Typescript doesn't do it this way.
    private static _ = (() => {
        Object.assign(Control.prototype, {
            _x: 0,
            _y: 0,
            width: 100,
            height: 50,
            color: Color.black,
            margin: Spacing.zero,
            padding: Spacing.zero,
        })
    })()

    set x(value) {
        if (this._x !== value) {
            this.transformValid = false
            this._x = value
        }
    }
    get x() {
        return this._x
    }
    set y(value) {
        if (this._y !== value) {
            this.transformValid = false
            this._y = value
        }
    }
    get y() {
        return this._y
    }

    draw(g: Graphics) {
        this.drawBackground(g)
        super.draw(g)
        if (this.text && g instanceof Graphics2D) {
            let c = g.context
            if (this.fontSize) {
                c.font = `normal ${this.fontSize}px sans-serif`
            }
            c.fillStyle = this.color.toString()
            c.textAlign = "center"
            c.textBaseline = "middle"
            // right now only draws centered
            c.fillText(this.text, this.width / 2, this.height / 2, this.width)
        }
    }

    protected drawBackground(g: Graphics) {
        if (this.backgroundColor || this.backgroundImage) {
            g.fillRectangle(0, 0, this.width, this.height, this.backgroundColor || Color.white, this.backgroundImage);
        }
    }

    protected calculateLocalTransform() {
        return (this.x !== 0 || this.y !== 0) ? Matrix4.translation(this.x, this.y, 0) : null
    }

    _transform?: Matrix4 | null
    get transform() {
        if (!this.transformValid) {
            this._transform = this.calculateLocalTransform()
            this.transformValid = true
        }
        return this._transform
    }

    updateChildren(g: Graphics) {
        this.layoutChildren(this)
        return super.updateChildren(g)
    }

    get size() { return new Size(this.width, this.height) }
    set size(value) {
        this.width = value.width
        this.height = value.height
    }
    get bounds() { return new Rectangle(this.x, this.y, this.width, this.height) }
    set bounds(value) {
        this.x = value.x
        this.y = value.y
        this.width = value.width
        this.height = value.height
    }
    get position() { return new Vector3(this.x, this.y) }
    set position(value) {
        this.x = value.x
        this.y = value.y
    }
    get boundingShape() { return new Rectangle(0, 0, this.width, this.height) }

    get isVisible() {
        return this.backgroundImage || (this.backgroundColor && this.backgroundColor.isVisible)
    }

    _pickable?: Pickable
    get pickable() {
        let value = this._pickable
        if (value == null) {
            value = Pickable.children
            if (this.isVisible || this.onpointerdown || this.onpointerup || this.onpointermove) {
                value |= Pickable.self
            }
        }
        return value

    }
    set pickable(value: Pickable) {
        this._pickable = value
    }

    //  pick children in reverse because we render the latter ones on top of the former
    protected get pickChildrenReverse() { return true }
    pickSelf(ray: Capsule) {
        if (this.pickRadius) {
            ray = ray.addRadius(this.pickRadius)
        }
        let intersection = this.boundingShape.intersectsCapsule(ray)
        return intersection ? new PickResult(this, intersection) : null
    }

}
