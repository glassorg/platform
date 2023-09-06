import { INode } from "../../INode.js";
import { NodeFactory } from "../../NodeFactory.js";
import { NodeType } from "../../NodeTypes.js";
import Animator, { AnimatorProps } from "./Animator.js";
import Control, { ControlProps } from "./Control.js";
import Geometry, { GeometryProps } from "./Geometry.js";
import SceneNode, { SceneNodeProps } from "./SceneNode.js";
import { SceneNodeName, sceneNodeNameToType, sceneNodeNames } from "./SceneNodeTypes.js";
import Screen, { ScreenProps } from "./Screen.js";
import View, { ViewProps } from "./View.js";

export class SceneNodeFactory extends NodeFactory<SceneNodeName> {

    public createNode(ofType: SceneNodeName) {
        return new sceneNodeNameToType[ofType]() as any as NodeType<SceneNodeName>;
    }

    public apply(to: (INode & Animator<any>) | (INode & Control) | (INode & Geometry) | (INode & Screen) | (INode & View) | (INode & SceneNode), properties: AnimatorProps<any> | ControlProps | SceneNodeProps | GeometryProps | ScreenProps | ViewProps): void {
        super.apply(to, properties);
        console.log(`invalidate`, to);
        to.invalidate();
    }

    public static readonly instance = new SceneNodeFactory();

}

NodeFactory.registerFactory(sceneNodeNames, SceneNodeFactory.instance);

