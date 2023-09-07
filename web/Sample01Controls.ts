import { button, div, element, h1 } from "../src/ui/html/elements.js";
import { customElement } from "../src/ui/html/customElement.js";
import { NodeBlueprint } from "../src/ui/NodeBlueprint.js";
import { graphicsCanvas } from "../src/ui/graphics/Canvas.js";
import { screen } from "../src/ui/graphics/scene/sceneNodes.js";
import Color from "../src/ui/math/Color.js";
import { useState } from "../src/ui/hooks/useState.js";

// const hoverControl = custom

export const sample01Controls = customElement(
    function () {
        const [count, setCount] = useState(0);
        return (
            element({ style: { color: "purple", border: "solid 1px blue", display: "block" } },
                h1(`Sample 01 Controls `),
                div({ style: { color: "red" } }),
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
