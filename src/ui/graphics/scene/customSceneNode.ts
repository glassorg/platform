import { NodeBlueprint } from "../../NodeBlueprint.js";
import { NodeName, NodeType } from "../../NodeTypes.js";
import { objectsEqualShallow } from "../../../common/arraysEqualShallow.js";
import { NoUnion } from "../../../common/types.js";
import { NodeFactory } from "../../NodeFactory.js";
import { SceneNodeName } from "./SceneNodeTypes.js";
import { sceneNodeNameToType } from "./SceneNodeTypes.js";
import { INode } from "../../INode.js";
import { getWebComponentClass } from "../../html/WebComponent.js";
import { SceneNodeFactory } from "./SceneNodeFactory.js";

type CustomElementProps = { children?: NodeBlueprint<SceneNodeName>[] | undefined };

type ReturnType<Props extends CustomElementProps> = (
    props?: Omit<Props, "children">,
    ...children: Props["children"] extends NodeBlueprint[] ? Props["children"] : never[]
) => NodeBlueprint;

let defineCount = 0;

export function customElement<Props extends CustomElementProps>(
    render: ((this: NodeType<"SceneNode">, props: Props) => NodeBlueprint<"SceneNode">),
    options?: {
        nodeName?: string
    }
): ReturnType<Props>
export function customElement<Props extends CustomElementProps, Name extends SceneNodeName>(
    render: ((this: NodeType<NoUnion<Name>>, props: Props) => NodeBlueprint<NoUnion<Name>>),
    options: {
        nodeName?: string,
        extends: NoUnion<Name>,
    }
): ReturnType<Props>
export function customElement<Props extends CustomElementProps, Name extends SceneNodeName = "SceneNode">(
    createBlueprints: ((props: Props) => NodeBlueprint<Name>),
    options: {
        nodeName?: string,
        extends?: Name,
    } = {}
): ReturnType<Props> {
    const {
        nodeName = `scene-node-${defineCount++}`,
    } = options;
    const baseClass = getWebComponentClass(
        sceneNodeNameToType[options?.extends ?? "SceneNode"] as new () => INode
    );
    class FunctionalSceneNodeComponent extends baseClass {
        //  SOME duplication with customElement.
        private _properties?: Props;
        get properties(): Props {
            return this._properties!;
        }
        set properties(value: Props) {
            if (!this._properties || !objectsEqualShallow(value, this._properties)) {
                this._properties = value;
                this.invalidate();
            }
        }

        createBlueprints(): NodeBlueprint<Name> {
            // the blueprint returned by render WILL be applied directly to this node.
            return createBlueprints.call(this, this.properties);
        }
    }

    NodeFactory.registerFactory([nodeName], new SceneNodeFactory(FunctionalSceneNodeComponent));

    return function (props, ...children) {
        //  the function to create this custom element, creates this element
        //  using a NodeBlueprint with everything in a .properties object, no children.
        //  it is up to the component to decide what *actual* children to add.
        return new NodeBlueprint(nodeName as NodeName, { properties: { ...props, children: children } });
    };

}
