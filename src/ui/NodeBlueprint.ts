import { memoize } from "../common/functions.js";
import { NodeFactory } from "./NodeFactory.js";
import { NodeChildName, NodeName, NodeProperties, NodeType } from "./NodeTypes.js";

const toLowerCase = memoize((name: string) => name.toLowerCase());

export class NodeBlueprint<Name extends NodeName = NodeName> {
    constructor(
        public readonly type: Name,
        public readonly properties?: NodeProperties<Name>,
        public readonly children?: NodeBlueprint<NodeChildName<Name>>[],
    ) {
    }

    public applyTo(node?: NodeType<Name>): NodeType<Name> {
        const factory = NodeFactory.getFactory(this.type);
        if (!node) {
            node = factory.createNode(this.type);
        }
        if (this.properties) {
            factory.apply(node, this.properties);
        }
        // if children are NOT specified then we neither add nor remove.
        if (this.children) {
            let maybeRecycle = node.firstChild;
            for (let child of this.children) {
                const canRecycle = maybeRecycle && toLowerCase(maybeRecycle.nodeName) === child.type;
                // console.log(`canRecycle: ${toLowerCase(maybeRecycle?.nodeName ?? "undefined")} === ${child.type}: ${canRecycle}`);
                if (canRecycle) {
                    child.applyTo(maybeRecycle as NodeType<NodeChildName<Name>>);
                    maybeRecycle = maybeRecycle!.nextSibling;
                }
                else {
                    const newChildNode = child.applyTo();
                    if (maybeRecycle) {
                        node.replaceChild(newChildNode, maybeRecycle);
                        maybeRecycle = newChildNode.nextSibling;
                    }
                    else {
                        node.appendChild(newChildNode);
                    }
                }
            }
            while (maybeRecycle) {
                let nextSibling = maybeRecycle.nextSibling;
                node.removeChild(maybeRecycle);
                maybeRecycle = nextSibling;
            }
        }
        return node;
    }
}