import { button, div, element } from "../src/ui/html/elements.js";
import { customElement } from "../src/ui/html/customElement.js";
import { NodeBlueprint } from "../src/ui/NodeBlueprint.js";
import { graphicsCanvas } from "../src/ui/graphics/Canvas.js";
import { screen } from "../src/ui/graphics/scene/sceneNodes.js";
import Color from "../src/ui/math/Color.js";
import { useState } from "../src/ui/hooks/useState.js";

export const helloElement = customElement(
    function ({ name, children }: { name: string, children: NodeBlueprint[] }) {
        console.log(`helloElement`, this);
        const [count, setCount] = useState(0);
        return (
            element({ style: { color: "purple", border: "solid 1px blue", display: "block" } },
                `Hello ${name}! `,
                div({ style: { color: "red" } }, ...children),
                myButton({}, "My Button Content"),
                div(
                    {
                        onclick(e) {
                            setCount(count + 1);
                        }
                    },
                    graphicsCanvas(
                        { width: 200, height: 200, dimensions: 2, style: { background: "beige", border: "solid 1px black" } },
                        screen({ backgroundColor: count % 2 === 0 ? Color.aliceblue : Color.palevioletred })
                    )
                )
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
