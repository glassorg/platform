import SceneNode from "./SceneNode.js";
import Graphics from "../Graphics.js";
import { NodeName } from "../../NodeTypes.js";

export interface AnimatorProps<T> {
    source: (time: number) => T
    target?: any
    property: any
}

export default class Animator<T> extends SceneNode {

    source!: (time: number) => T
    target?: any
    property!: any

    get nodeName(): NodeName { return "Animator" }

    update(g: Graphics) {
        let target = this.target || this.parentNode as any
        let value = this.source(g.time)
        target[this.property] = value
        return true
    }

}
