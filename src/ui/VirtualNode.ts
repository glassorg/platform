import { INode } from "./INode.js";
import { NodeName } from "./NodeTypes.js";

export function extendElementAsVirtualNodeRoot<T>(element: T): T & INode {
    return Object.defineProperties(element, {
        previousSibling: {
            writable: true,
            value: null,
        },
        nextSibling: {
            writable: true,
            value: null,
        },
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

export default abstract class VirtualNode implements INode {

    id?: string
    parentNode: INode | null = null
    firstChild: INode | null = null
    lastChild: INode | null = null
    nextSibling: INode | null = null
    previousSibling: INode | null = null

    properties?: any
    isDirty: boolean = false

    abstract nodeName: NodeName

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
        console.log(`set parentNode`, child)
        return child
    }

    get isConnected() {
        return this.parentNode?.isConnected ?? false;
    }

    /**
     * Flags this node and all clean ancestors as dirty.
     */
    markDirty() {
        for (let node: INode | null = this; node != null && node.isDirty === false; node = node.parentNode) {
            node.isDirty = true
        }
    }

    addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: AddEventListenerOptions | boolean,
    ): void {

    }
    /** Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise. */
    dispatchEvent(event: Event): boolean {
        return false;
    }
    /** Removes the event listener in target's event listener list with the same type, callback, and options. */
    removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: EventListenerOptions | boolean,
    ): void {

    }

}
