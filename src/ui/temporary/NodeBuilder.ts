// import { assignIfDifferent } from "../../common/functions.js";
// import { INode } from "./INode.js";
// import { NodeWriter } from "./NodeWriter.js";
// import { NodeType } from "./NodeType.js";

// export type NodeDeclaration = NodeBuilder | string;

// export class NodeBuilder<T extends Node = Node> {

//     constructor(
//         public readonly type: NodeType,
//         public readonly properties: Record<string, any>,
//         public readonly children: (NodeBuilder | string)[],
//         public readonly style?: Partial<CSSStyleDeclaration>,
//         public readonly attributes?: Attributes,
//     ) {
//     }

//     apply(to: HTMLElement) {
//         let pointer = new NodeWriter(to);
//         function renderNode(builder: NodeBuilder) {
//             const node = pointer.begin(builder.type);
//             builder.applyProperties(node);
//             for (let i = 0; i < builder.children.length; i++) {
//                 let child = builder.children[i];
//                 let node: INode;
//                 if (typeof child === "string") {
//                     pointer.text(child);
//                 }
//                 else {
//                     renderNode(child);
//                 }
//             }
//             pointer.end();
//         }

//         renderNode(this);

//         // to.replaceChildren();
//         // to.appendChild(this.toElement());

//     }

//     private applyProperties(to: INode) {
//         if (to instanceof HTMLElement) {
//             if (this.attributes) {
//                 for (let name in this.attributes) {
//                     let value = this.attributes[name];
//                     if (value === false) {
//                         to.removeAttribute(name);
//                     }
//                     else {
//                         to.setAttribute(name, value === true ? "" : value);
//                     }
//                 }
//             }
//             if (this.style) {
//                 assignIfDifferent(to.style, this.style);
//             }
//         }
//         if (this.properties) {
//             assignIfDifferent(to, this.properties);
//         }
//     }

//     private toElement() {
//         const { type } = this;
//         let element = typeof type === "function" ? new (type as any)() : document.createElement(type);
//         this.applyProperties(element);
//         if (this.children) {
//             for (let child of this.children) {
//                 element.appendChild(typeof child === "string" ? document.createTextNode(child) : child.toElement());
//             }
//         }
//         return element;
//     }

// }

// //  Ideally, we can use a react hooks style pure functional component declaration.
// //  with useState and useEffect
// //  which are the most useful and only really necessary hooks.
// //  initially we can just toss and re-render this to DOM.
// //  then we can use the context style approach to do our rendering.

// type Attributes = Record<string, string | boolean>;
// export type PropertiesAndAttributes<T> = object & Partial<Omit<T, "attributes" | "style"> & {
//     class: string,
//     style: Partial<CSSStyleDeclaration>,
//     attributes: Attributes
// }>;
// export function isPropertiesAndAttributes<T>(value?: unknown): value is PropertiesAndAttributes<T> {
//     return value != null && typeof value === "object" && !(value instanceof NodeBuilder);
// }

