import { NodeBlueprint, toLowerCase } from "../NodeBlueprint.js";
import { getWebComponentClass } from "./WebComponent.js";
import { HTMLElementName } from "./HTMLNodeFactory.js";
import { NodeName } from "../NodeTypes.js";
import { objectsEqualShallow } from "../../common/arraysEqualShallow.js";
import { NoUnion } from "../../common/types.js";


let defineCount = 0;
export function customElement<Props extends Record<string, any>>(
    render: ((props: Props) => NodeBlueprint<"HTMLELEMENT">),
    options?: {
        tagName?: string
    }
)
export function customElement<Props extends Record<string, any>, Name extends HTMLElementName>(
    render: ((props: Props) => NodeBlueprint<NoUnion<Name>>),
    options: {
        tagName?: string,
        extends: NoUnion<Name>,
    }
)
export function customElement<Props extends Record<string, any>, Name extends HTMLElementName = "SPAN">(
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
    customElements.define(tagName, FunctionalWebComponent, { extends: options.extends?.toLowerCase() });

    //  register factory as well. no longer need this since there is a default html node factory
    // NodeFactory.registerFactory([tagName], HTMLElementFactory.instance);

    return function ({ style, ...props }: Omit<Props, "children"> & { style?: CSSStyleDeclaration }, ...children: Props["children"]) {
        //  the function to create this custom element, creates this element
        //  using a NodeBlueprint with everything in a .properties object, no children.
        //  it is up to the component to decide what *actual* children to add.
        return new NodeBlueprint(tagName as NodeName, { properties: { ...props, children } } as any);
    };
}