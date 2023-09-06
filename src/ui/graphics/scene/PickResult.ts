import SceneNode from "./SceneNode.js";
import Vector3 from "../../math/Vector3.js";

export default class PickResult {

    node: SceneNode
    position: Vector3

    constructor(node: SceneNode, position: Vector3) {
        this.node = node
        this.position = position
    }

}