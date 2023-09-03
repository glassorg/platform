import { getWebComponentClass } from "../src/ui/html/WebComponent.js";
import { button, div, li, ul } from "../src/ui/html/elements.js";
import { useState } from "../src/ui/hooks/useState.js";
import { helloElement } from "./HelloElement.js";
// import { helloComponent } from "./HelloComponent.js";

export class MyCustomBase extends getWebComponentClass() {

    render() {
        const [count, setCount] = useState(0);
        const [name, setName] = useState("name");
        return (
            div({ style: { color: "orange" } }, `Custom Div Content!`,
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
customElements.define("my-custom-base", MyCustomBase);
