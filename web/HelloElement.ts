import { button, div, element } from "../src/ui/html/elements.js";
import { customElement } from "../src/ui/html/customElement.js";
import { NodeBlueprint } from "../src/ui/NodeBlueprint.js";

export const helloElement = customElement(
    function ({ name, children }: { name: string, children: NodeBlueprint[] }) {
        console.log(`helloElement`, this);
        return (
            element({ style: { color: "purple", border: "solid 1px blue", display: "block" } },
                `Hello ${name}! `,
                div({ style: { color: "red" } }, ...children),
                myButton({}, "My Button Content"),
            )
        );
    }, { tagName: "hello-element" }
)

export const myButton = customElement(
    function (props: { children: NodeBlueprint<"UL" | "#text">[] }) {
        console.log(`myButton`, this);
        return button({ style: { color: "red" } }, ...props.children);
    },
    { extends: "BUTTON", tagName: "my-button" }
)
