import Node from "./Node";
import Graphics from "../Graphics";

export default class Animator<T> extends Node {

    source!: (time: number) => T
    target?: any
    property!: any

    update(g: Graphics) {
        let target = this.target || this.parentNode as any
        let value = this.source(g.time)
        target[this.property] = value
        return true
    }

}
