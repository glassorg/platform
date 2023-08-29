import { WebComponent } from "../src/ui/WebComponent.js";
import { button, div, li, ul } from "../src/ui/NodeBuilder.js";
import { useState } from "../src/ui/hooks.js";
import { helloComponent } from "./HelloComponent.js";

export class MyCustomBase extends WebComponent {

    render() {
        const [count, setCount] = useState(0);
        const [name, setName] = useState("name");
        return (
            div({ style: { color: "orange" } }, `Custom Div Content!`,
                ul(
                    li({ style: { color: "red" } }, "Foo"),
                    li({ style: { color: "blue" } }, "Bar"),
                ),
                helloComponent({ name }, "foo"),
                button({
                    onclick(e) {
                        setCount(count + 1);
                        setName(name + "!");
                    }
                }, `Clicked ${count}`),
            )
        );
    }

}
customElements.define("my-custom-base", MyCustomBase);
