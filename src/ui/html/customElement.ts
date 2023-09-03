import { NodeBlueprint } from "../NodeBlueprint.js";
import { getWebComponentClass } from "./WebComponent.js";
import { HTMLElementFactory, HTMLElementName } from "./HTMLNodeFactory.js";
import { NodeName } from "../NodeTypes.js";
import { NodeFactory } from "../NodeFactory.js";
import { objectsEqualShallow } from "../../common/arraysEqualShallow.js";

let defineCount = 0;
export function customElement<Props extends Record<string, any>, Name extends HTMLElementName = HTMLElementName>(
    render: ((props: Props) => NodeBlueprint<Name>),
    options: {
        tagName?: string,
        extends?: Name,
    } = {}
) {
    const {
        tagName = `component-${defineCount++}`,
    } = options;
    const baseClass = getWebComponentClass<Name>(options.extends);
    class FunctionalWebComponent extends baseClass {
        private _properties?: Props;
        // get isComponent() { return true; }
        get properties(): Props {
            return this._properties!;
        }
        set properties(value: Props) {
            if (!this._properties || !objectsEqualShallow(value, this._properties)) {
                this._properties = value;
                this.invalidate();
            }
        }
        render(): NodeBlueprint<Name> {
            // the blueprint returned by render WILL be applied directly to this node.
            return render.call(this, this.properties);
        }
    }

    //  this must be called before a webcomponent can be constructed or you get an Illegal constructor error
    customElements.define(tagName, FunctionalWebComponent, { extends: options.extends });

    //  register factory as well. no longer need this since there is a default html node factory
    // NodeFactory.registerFactory([tagName], HTMLElementFactory.instance);

    return function ({ style, ...props }: Omit<Props, "children"> & { style?: CSSStyleDeclaration }, ...children: Props["children"]) {
        //  the function to create this custom element, creates this element
        //  using a NodeBlueprint with everything in a .properties object, no children.
        //  it is up to the component to decide what *actual* children to add.
        return new NodeBlueprint(tagName as NodeName, { properties: { ...props, children } } as any);
    };
}