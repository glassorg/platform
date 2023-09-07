import { INode } from "../../INode.js";
import { NodeFactory } from "../../NodeFactory.js";
import { NodeName, NodeType } from "../../NodeTypes.js";
import VirtualNode from "../../VirtualNode.js";
import Invalidatable from "../Invalidatable.js";
import { SceneNodeName, sceneNodeNameToType, sceneNodeNames } from "./SceneNodeTypes.js";

export class SceneNodeFactory extends NodeFactory {

    constructor(
        private readonly classConstructor: new () => INode & Invalidatable
    ) {
        super();
    }

    public createNode(ofType: SceneNodeName) {
        return new this.classConstructor() as any;
    }

    public apply(to: NodeType<NodeName> & VirtualNode & Invalidatable, properties: any): void {
        // TODO: only mark dirty if changed.
        super.apply(to as any, properties);
        to.markDirty();
    }

}

for (let name of sceneNodeNames) {
    let type = sceneNodeNameToType[name];
    console.log(`register`, name, type);
    NodeFactory.registerFactory([name as any], new SceneNodeFactory(type as any));
}
