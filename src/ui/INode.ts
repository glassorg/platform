
export interface INode {
    nodeName?: string;

    //  Composition methods compatible with Html Node
    appendChild(child: INode);
    removeChild(child: INode);
    insertBefore(child: INode, ref?: INode | null);
    lastChild: INode | null;
    firstChild: INode | null;
    parentNode: INode | null;
    nextSibling: INode | null;
    previousSibling: INode | null;

    //  text
    // createTextNode?: (text: string) => INode;

    //  invalidation
    dirty?: boolean;

}

// (HTMLElement.prototype as INode).createTextNode = (text: string) => document.createTextNode(text);
