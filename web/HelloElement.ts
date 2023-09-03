import { div } from "../src/ui/html/elements.js";
import { NodeBlueprint } from "../src/ui/NodeBlueprint.js";
import { HTMLElementName } from "../src/ui/html/HTMLNodeFactory.js";
import { customElement } from "../src/ui/html/customElement.js";
// import { myButton } from "./MyButton.js";

type Props = { name: string, style?: Partial<CSSStyleDeclaration>, children: (NodeBlueprint<HTMLElementName> | string)[] };
export const helloElement = customElement(
    (props: Props) => {
        console.log(`helloElement`, { props });
        const { name, children } = props ?? { name: "unloaded", children: [] };
        return (
            div({ style: { color: "purple", border: "solid 1px blue", display: "block" } },
                `Hello ${name}! `,
                div({ style: { color: "red" } }, ...children),
                // myButton({}, "My Button Content")
            )
        );
    }, { tagName: "hello-element" }
)
