import { INode } from "./INode.js";
import { NodeConstructor } from "./NodeConstructor.js";

export type NodeType<T extends INode = INode> = string | NodeConstructor<T>;

export const TextType = "#text";

export function createNode<T extends INode = INode>(type: NodeType<T>): T {
    if (typeof type === "string") {
        if (type === TextType) {
            return document.createTextNode("") as unknown as T;
        }
        else {
            return document.createElement(type) as unknown as T;
        }
    } else {
        return new type();
    }
}

export function isNodeType(node: INode | null, type: NodeType) {
    if (!node) {
        return false;
    }
    return typeof type === "string" ?
        node.nodeName === type || node.nodeName === type.toUpperCase()
        : node.constructor === type;
}
