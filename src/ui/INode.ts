import { NodeName } from "./NodeTypes.js";

export interface INode {
    //  Type properties from DOM Node.
    nodeName: NodeName;

    //  Composition functions compatible with DOM Node
    appendChild(child: INode);
    removeChild(child: INode);
    insertBefore(child: INode, ref?: INode | null);
    lastChild: INode | null;
    firstChild: INode | null;
    parentNode: INode | null;
    nextSibling: INode | null;
    previousSibling: INode | null;

    //  Does this node need to repaint?
    isDirty?: boolean;
    //  Is this a component that manages it's own properties and children?
    isComponent?: boolean;
    //  Is this node a virtual node?
    isVirtual?: boolean;

}
