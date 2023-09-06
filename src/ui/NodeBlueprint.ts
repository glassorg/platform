import { memoize } from "../common/functions.js";
import { INode } from "./INode.js";
import { NodeFactory } from "./NodeFactory.js";
import { NodeChildName, NodeName, NodeProperties, NodeType } from "./NodeTypes.js";

export const toLowerCase = memoize((name: string) => name.toLowerCase());

function isSameNodeType(node: INode, type: string) {
    let { nodeName } = node;
    if (nodeName === type || toLowerCase(nodeName) === type) {
        return true;
    }
    return false;
}

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
                const canRecycle = maybeRecycle && isSameNodeType(maybeRecycle, child.type);
                // if (!canRecycle) {
                //     console.log(`canRecycle: ${maybeRecycle?.nodeName} === ${child.type}: ${canRecycle}`);
                // }
                if (canRecycle) {
                    child.applyTo(maybeRecycle as NodeType<NodeChildName<Name>>);
                    maybeRecycle = maybeRecycle!.nextSibling;
                }
                else {
                    const newChildNode = child.applyTo();
                    if (maybeRecycle) {
                        node.insertBefore(newChildNode, maybeRecycle);
                        node.removeChild(maybeRecycle);
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