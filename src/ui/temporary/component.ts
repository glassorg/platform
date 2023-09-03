// import { NodeBuilder } from "./NodeBuilder.js";
// import { getWebComponentClass } from "./WebComponent.js";

// let defineCount = 0;
// export function component<Props extends Record<string, any>>(
//     render: ((props: Props) => NodeBuilder | void),
//     options: {
//         tagName?: string,
//         extends?: string,
//     } = {}
// ) {
//     const {
//         tagName = `component-${defineCount++}`,
//     } = options;
//     class FunctionalWebComponent extends getWebComponentClass(options.extends) {
//         declare properties: Props;
//         render(): NodeBuilder | void {
//             console.log(`render ${tagName}`);
//             return render.call(this, this.properties);
//         }
//     }

//     // this must be called before a webcomponent can be constructed or you get an Illegal constructor error
//     customElements.define(tagName, FunctionalWebComponent, { extends: options.extends });

//     return function ({ style, ...props }: Omit<Props, "children"> & { style?: CSSStyleDeclaration }, ...children: Props["children"]) {
//         return new NodeBuilder(FunctionalWebComponent, { properties: { ...props, children } }, [], style);
//     };
// }