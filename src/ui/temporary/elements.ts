// import { StringKeyof } from "../../common/types.js";
// import { NodeBuilder, isPropertiesAndAttributes } from "./NodeBuilder.js";
// import { NodeNameMap } from "./nodes.js";

// type Properties<T> = { [K in keyof T]?: T[K] };

// export type ElementChildrenMap = {
//     "ul": "li",
//     "ol": "li",
// } & {
//         [K in keyof HTMLElementTagNameMap]: { class?: string, style: Partial<CSSStyleDeclaration> }
//     }

// type ElementChild<TagName extends keyof HTMLElementTagNameMap> = TagName extends StringKeyof<ElementChildrenMap> ? ElementChildrenMap[TagName] : (keyof HTMLElementTagNameMap | string);
// type ElementProperties<TagName extends keyof HTMLElementTagNameMap> = Properties<HTMLElementTagNameMap[TagName]>;

// export function element<
//     TagName extends keyof HTMLElementTagNameMap,
// >(tagName: TagName) {
//     // function create(
//     //     ...children: ElementChildren<TagName>[]
//     // ): NodeBuilder<NodeNameMap[TagName]>
//     function create(
//         props?: ElementProperties<TagName>,
//         ...children: ElementChild<TagName>[]
//     ): NodeBuilder<NodeNameMap[TagName]>
//     // function create(
//     //     props?: ElementProperties<TagName> | ElementChildren<TagName>,
//     //     ...children: ElementChildren<TagName>[]
//     // )
//     {
//         const { class: className, style, attributes, ...properties } = props as any || {};
//         if (className) {
//             properties.className = className;
//         }
//         return new NodeBuilder(tagName, properties, children as any, style, attributes);
//         // if (isPropertiesAndAttributes<ElementProperties<TagName>>(props)) {
//         // }
//         // else {
//         //     return new NodeBuilder(tagName, {}, [props as ElementChildren<TagName>, ...children]);
//         // }
//     };

//     return create;
// }

// export const div = element("div");
// export const span = element("span");
// export const input = element("input");
// export const button = element("button");
// export const textArea = element("textarea");
// export const h1 = element("h1");
// export const h2 = element("h2");
// export const h3 = element("h3");
// export const h4 = element("h4");
// export const ol = element("ol");
// export const ul = element("ul");
// export const li = element("li");
