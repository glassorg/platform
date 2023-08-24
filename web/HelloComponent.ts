import { NodeBuilder, div } from "../src/ui/NodeBuilder.js";
import { component } from "../src/ui/component.js";

export const helloComponent = component(
    ({ name, children }: { name: string, children: (NodeBuilder | string)[] }) => {
        return (
            div({ style: { color: "purple" } }, `Hello ${name}! `,
                div({ style: { color: "red" } }, ...children)
            )
        );
    }
)
