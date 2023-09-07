import { getWebComponentClassByNodeName } from "../src/ui/html/WebComponent.js";
import { button, div, li, ul } from "../src/ui/html/elements.js";
import { useState } from "../src/ui/hooks/useState.js";
import { helloElement } from "./HelloElement.js";
import { NodeBlueprint } from "../src/ui/NodeBlueprint.js";

export class MyClassElement extends getWebComponentClassByNodeName() {

    render() {
        const [count, setCount] = useState(0);
        const [name, setName] = useState("name");
        return (
            div({ style: { color: "pink" } }, `Custom Div Content!`,
                ul(
                    li({ style: { color: "red" } }, "Foo"),
                    li({ style: { color: "blue" } }, "Bar"),
                ),
                helloElement({ name }, "child thing here"),
                button({
                    onclick(e) {
                        setCount(count + 1);
                        if (count % 3 === 0) {
                            setName(name + "!");
                        }
                    }
                }, `Clicked ${count}`),
            )
        );
    }
}
const myCustomBaseTagName = "my-class-element";
customElements.define(myCustomBaseTagName, MyClassElement as any);

declare module "../src/ui/NodeTypes.js" {
    export interface NodeNameToType {
        [myCustomBaseTagName]: MyClassElement
    }
    export interface NodeNameToProperties {
        [myCustomBaseTagName]: {}
    }
    export interface NodeNameToChildName {
        [myCustomBaseTagName]: never
    }
}

export function myClassElement() {
    return new NodeBlueprint(myCustomBaseTagName);
}