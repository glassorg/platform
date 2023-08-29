import Node from "./Node.js";
import Vector3 from "../../math/Vector3.js";

export default class PickResult {

    node: Node
    position: Vector3

    constructor(node: Node, position: Vector3) {
        this.node = node
        this.position = position
    }

}