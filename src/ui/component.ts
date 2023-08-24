import { NodeBuilder } from "./NodeBuilder.js";
import { WebComponent } from "./WebComponent.js";

let defineCount = 0;
export function component<
    Props extends Record<string, any>
>(
    render: ((props: Props) => NodeBuilder),
    tagName = `component-${defineCount++}`
) {
    class FunctionalWebComponent extends WebComponent {
        declare properties: Props;
        render(): NodeBuilder {
            return render.call(this, this.properties);
        }
    }

    // this must be called before a webcomponent can be constructed or you get an Illegal constructor error
    customElements.define(tagName, FunctionalWebComponent);

    return function ({ style, ...props }: Omit<Props, "children"> & { style?: CSSStyleDeclaration }, ...children: Props["children"]) {
        return new NodeBuilder(FunctionalWebComponent, { properties: { ...props, children } }, children, style);
    };
}