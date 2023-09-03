import { INode } from "../INode.js";
import { NodeName } from "../NodeTypes.js";
import Invalidatable from "../graphics/Invalidatable.js"

export function extendElementAsVirtualNodeRoot<T>(element: T): T & INode {
    return Object.defineProperties(element, {
        firstChild: {
            writable: true,
            value: null
        },
        lastChild: {
            writable: true,
            value: null
        },
        appendChild: {
            value: VirtualNode.prototype.appendChild
        },
        removeChild: {
            value: VirtualNode.prototype.removeChild
        },
        insertBefore: {
            value: VirtualNode.prototype.insertBefore
        }
    }) as any;
}

export default abstract class VirtualNode implements INode, Invalidatable {

    id?: string
    parentNode: INode | null = null
    firstChild: INode | null = null
    lastChild: INode | null = null
    nextSibling: INode | null = null
    previousSibling: INode | null = null

    properties?: any
    isDirty: boolean = false

    get nodeName(): NodeName {
        return "virtual-node" as NodeName;
    }

    // composition methods compatible with Html Node
    appendChild<T extends INode>(child: T): T {
        return this.insertBefore(child, null)
    }
    removeChild<T extends INode>(child: T): T {
        if (child.parentNode !== this) {
            throw new Error("node is not a child of this parentNode.")
        }
        if (this.firstChild === child) {
            this.firstChild = child.nextSibling
        }
        if (this.lastChild === child) {
            this.lastChild = child.previousSibling
        }
        if (child.previousSibling != null) {
            child.previousSibling.nextSibling = child.nextSibling
        }
        if (child.nextSibling != null) {
            child.nextSibling.previousSibling = child.previousSibling
        }
        child.parentNode = null
        child.previousSibling = null
        child.nextSibling = null
        return child
    }
    insertBefore<T extends INode>(child: T, ref: INode | null): T {
        if (child.parentNode != null) {
            child.parentNode.removeChild(child)
        }
        if (ref == null) {
            child.previousSibling = this.lastChild
            if (child.previousSibling != null) {
                child.previousSibling.nextSibling = child
            }
            if (this.firstChild == null) {
                this.firstChild = child
            }
            this.lastChild = child
        } else {
            if (ref.parentNode !== this) {
                throw new Error("Reference node is not a child")
            }
            child.previousSibling = ref.previousSibling
            if (child.previousSibling != null) {
                child.previousSibling.nextSibling = child
            }
            child.nextSibling = ref
            ref.previousSibling = child
            if (this.firstChild === ref) {
                this.firstChild = child
            }
        }
        child.parentNode = this
        return child
    }

    invalidate() {
        for (let node: INode | null = this; node != null && node.isDirty === false; node = node.parentNode) {
            node.isDirty = true
        }
    }


}
