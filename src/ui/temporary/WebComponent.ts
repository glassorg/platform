// import { memoize } from "../../common/functions.js";
// import { requestFrame } from "../../common/requestFrame.js";
// import { INode } from "./INode.js";
// import { NodeBuilder } from "./NodeBuilder.js";
// import Invalidatable from "../graphics/Invalidatable.js";

// abstract class AbstractRender {
//     abstract render(): NodeBuilder | void;
// }

// export type WebComponent<Base extends HTMLElement = HTMLElement> = Base & Invalidatable & AbstractRender & INode & {
//     hookIndex: number;
//     readonly hooks: any[];
// };

// export function isWebComponent(value): value is WebComponent {
//     return typeof value.hookIndex === "number";
// }

// export const getWebComponentClass: <Base extends HTMLElement>(tagName?: string) => (new () => WebComponent<Base>) = memoize(
//     (tagName?: string) => {
//         const baseClass = tagName
//             ? document.createElement(tagName).constructor as any as typeof HTMLElement
//             : HTMLElement;

//         abstract class WebComponent extends baseClass {

//             public hookIndex: number = 0;
//             public readonly hooks: any[];

//             constructor() {
//                 super();
//                 this.hooks = [];
//                 this.renderAndApply = this.renderAndApply.bind(this);
//                 console.log(`${this.tagName}.constructor`);
//             }

//             public invalidate() {
//                 requestFrame(this.renderAndApply);
//                 console.log(`${this.tagName}.invalidate`);
//             }

//             connectedCallback() {
//                 console.log(`${this.tagName}.connectedCallback`);
//                 this.invalidate();
//             }

//             disconnectedCallback() {
//                 console.log(`${this.tagName}.disconnectedCallback`);
//             }

//             attributeChangedCallback() {
//                 console.log(`${this.tagName}.attributeChangedCallback`);
//                 this.invalidate();
//             }

//             private renderAndApply() {
//                 console.log(`${this.tagName}.renderAndApply`);

//                 this.hookIndex = 0;
//                 renderStack.push(this as any);
//                 try {
//                     let content = this.render();
//                     if (content) {
//                         this.apply(content);
//                     }
//                 }
//                 finally {
//                     renderStack.pop();
//                 }
//             }

//             apply(node: NodeBuilder) {
//                 node.apply(this);
//             }

//             abstract render(): NodeBuilder | void;

//         }
//         return WebComponent as any;
//     }
// )

// // export abstract class WebComponent extends HTMLElement {

// //     public hookIndex: number = 0;
// //     public readonly hooks: any[];

// //     constructor() {
// //         super();
// //         this.hooks = [];
// //         this.renderAndApply = this.renderAndApply.bind(this);
// //         console.log(`${this.tagName}.constructor`);
// //     }

// //     public invalidate() {
// //         requestFrame(this.renderAndApply);
// //         console.log(`${this.tagName}.invalidate`);
// //     }

// //     connectedCallback() {
// //         console.log(`${this.tagName}.connectedCallback`);
// //         this.invalidate();
// //     }

// //     disconnectedCallback() {
// //         console.log(`${this.tagName}.disconnectedCallback`);
// //     }

// //     attributeChangedCallback() {
// //         console.log(`${this.tagName}.attributeChangedCallback`);
// //         this.invalidate();
// //     }

// //     private renderAndApply() {
// //         console.log(`${this.tagName}.renderAndApply`);

// //         this.hookIndex = 0;
// //         renderStack.push(this);
// //         try {
// //             this.apply(this.render());
// //         }
// //         finally {
// //             renderStack.pop();
// //         }
// //     }

// //     apply(node: NodeBuilder) {
// //         node.apply(this);
// //     }

// //     abstract render(): NodeBuilder;

// // }

// const renderStack: WebComponent[] = [];
// export function getCurrentWebComponent() {
//     return renderStack[renderStack.length - 1];
// }
