import { NodeBuilder, div } from "../src/ui/NodeBuilder.js";
import { component } from "../src/ui/component.js";

export const helloComponent = component(
    (props: { name: string, children: (NodeBuilder | string)[] }) => {
        const { name, children } = props ?? { name: "unloaded", children: [] };
        return (
            div({ style: { color: "purple" } },
                `Hello ${name}! `,
                div({ style: { color: "red" } }, ...children),
            )
        );
    }, "hello-component"
)
