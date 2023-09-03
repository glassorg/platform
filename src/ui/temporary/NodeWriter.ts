// import { INode } from "./INode.js"
// import { NodeType, TextType, createNode, isNodeType } from "./NodeType.js"
// import { isWebComponent } from "./WebComponent.js";

// export class NodeWriter {

//     private elements: Array<INode | null> = [];

//     constructor(parent: INode, insertAfterNode: INode | null = null) {
//         this.elements.push(parent, insertAfterNode);
//     }

//     public begin<T extends INode>(type: NodeType<T>) {
//         // we recycle nodes if they are of the same type
//         let maybeRecycle = this.insertBefore;
//         let node = isNodeType(maybeRecycle, type) ? maybeRecycle : null;
//         if (node == null) {
//             //  create a new node
//             node = createNode(type);
//             this.insert(node);
//         }
//         if (maybeRecycle && maybeRecycle !== node) {
//             // delete the pointed at node immediately
//             this.parentNode.removeChild(maybeRecycle);
//         }
//         this.push(node);
//         return node;
//     }

//     public end() {
//         let node = this.parentNode;
//         //  remove any remaining children following the insert after
//         if (!isWebComponent(node)) {
//             let remove: INode | null
//             while (remove = this.insertBefore) {
//                 console.log(`${node.nodeName}.removing child: ${remove}`);
//                 node.removeChild(remove);
//             }
//         }
//         this.pop();
//     }

//     public text(content: string) {
//         let node = this.begin(TextType) as Text;
//         if (node.textContent !== content) {
//             node.textContent = content;
//         }
//         this.end();
//         return node;
//     }

//     private push(element: INode) {
//         this.insertAfter = element;
//         this.elements.push(element, null);
//     }
//     private pop() {
//         let current = this.elements[this.elements.length - 2];
//         this.elements.length -= 2;
//         return current!;
//     }

//     private get parentNode(): INode { return this.elements[this.elements.length - 2] as INode }
//     private insert<T extends INode>(node: T) {
//         this.parentNode.insertBefore(node, this.insertBefore);
//         return node;
//     }

//     private get insertAfter(): INode | null { return this.elements[this.elements.length - 1] }
//     private set insertAfter(element: INode | null) { this.elements[this.elements.length - 1] = element }

//     private get insertBefore() {
//         let insertAfter = this.insertAfter;
//         let insertBefore = insertAfter != null ? insertAfter.nextSibling : this.parentNode.firstChild;
//         return insertBefore;
//     }

// }
