// import { NodeBuilder } from "../src/ui/temporary/NodeBuilder.js";
// import { WebComponent } from "../src/ui/html/WebComponent.js";
// import { component } from "../src/ui/temporary/component.js";
// import { useEffect } from "../src/ui/hooks/useEffect.js";

// export const myButton = component(
//     (props: { children: (NodeBuilder | string)[] }) => {
//         const { children } = props ?? { name: "unloaded", children: [] };
//         // use effect for now
//         useEffect(function (this: WebComponent<HTMLButtonElement>) {
//             this.innerHTML = "Added in Effect";
//         });
//         //  button... don't render anything on it yet.
//         //  as we don't have a self render.
//     }, { tagName: "my-button", extends: "button" }
// )
