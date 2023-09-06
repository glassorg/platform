import { NodeBlueprint } from "../../NodeBlueprint.js";
import { NodeChildName, NodeProperties } from "../../NodeTypes.js";
import { SceneNodeName } from "./SceneNodeTypes.js";
import "./SceneNodeFactory.js";

function createBlueprintFactory<
    Name extends SceneNodeName,
>(type: Name) {
    function create(properties?: NodeProperties<Name>, ...children: NodeBlueprint<NodeChildName<Name>>[]): NodeBlueprint<Name>
    function create(...children: (NodeBlueprint<NodeChildName<Name>>)[]): NodeBlueprint<Name>
    function create(propertiesOrFirstChild?: NodeProperties<Name> | NodeBlueprint<NodeChildName<Name>>, ...otherChildren: NodeBlueprint<NodeChildName<Name>>[]) {
        let properties: NodeProperties<Name> | undefined;
        let children: NodeBlueprint<NodeChildName<Name>>[] | undefined;
        if (propertiesOrFirstChild instanceof NodeBlueprint) {
            otherChildren.unshift(propertiesOrFirstChild);
        }
        else {
            properties = propertiesOrFirstChild;
        }
        for (let child of otherChildren) {
            if (!children) {
                children = [];
            }
            children.push(child);
        }
        return new NodeBlueprint(type, properties, children);
    }
    return create;
}

export const animator = createBlueprintFactory("Animator");
export const control = createBlueprintFactory("Control");
export const screen = createBlueprintFactory("Screen");
export const view = createBlueprintFactory("View");
export const geometry = createBlueprintFactory("Geometry");
export const sceneNode = createBlueprintFactory("SceneNode");
