import { NodeBlueprint, toLowerCase } from "../NodeBlueprint.js";
import { getWebComponentClass } from "./WebComponent.js";
import { HTMLElementFactory, HTMLElementName } from "./HTMLNodeFactory.js";
import { NodeName, NodeType } from "../NodeTypes.js";
import { objectsEqualShallow } from "../../common/arraysEqualShallow.js";
import { NoUnion } from "../../common/types.js";
import { text } from "./elements.js";
import { NodeFactory } from "../NodeFactory.js";

type CustomElementProps = { style?: Partial<CSSStyleDeclaration>, children?: NodeBlueprint[] | undefined };

type ReturnType<Props extends CustomElementProps> = (
    props: Omit<Props, "children">,
    ...children: Props["children"] extends NodeBlueprint<infer ChildNames>[] ? ("#text" extends ChildNames ? ((NodeBlueprint<ChildNames> | string)[] | Props["children"]) : Props["children"]) : never
) => NodeBlueprint;

let defineCount = 0;
export function customElement<Props extends CustomElementProps>(
    render: ((this: NodeType<"HTMLELEMENT">, props: Props) => NodeBlueprint<"HTMLELEMENT">),
    options?: {
        tagName?: string
    }
): ReturnType<Props>
export function customElement<Props extends CustomElementProps, Name extends HTMLElementName>(
    render: ((this: NodeType<NoUnion<Name>>, props: Props) => NodeBlueprint<NoUnion<Name>>),
    options: {
        tagName?: string,
        extends: NoUnion<Name>,
    }
): ReturnType<Props>
export function customElement<Props extends CustomElementProps, Name extends HTMLElementName = "SPAN">(
    render: ((props: Props) => NodeBlueprint<Name>),
    options: {
        tagName?: string,
        extends?: Name,
    } = {}
): ReturnType<Props> {
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

        constructor() {
            super();
        }

        render(): NodeBlueprint<Name> {
            // the blueprint returned by render WILL be applied directly to this node.
            return render.call(this, this.properties);
        }
    }

    //  this must be called before a webcomponent can be constructed or you get an Illegal constructor error
    customElements.define(tagName, FunctionalWebComponent, { extends: options.extends?.toLowerCase() });

    //  if this extends a built in type then we must register a custom element factory to create it.
    if (options.extends) {
        NodeFactory.registerFactory([tagName], new CustomElementFactory(options.extends, tagName));
    }

    return function (props, ...children) {
        //  the function to create this custom element, creates this element
        //  using a NodeBlueprint with everything in a .properties object, no children.
        //  it is up to the component to decide what *actual* children to add.
        return new NodeBlueprint(tagName as NodeName, { properties: { ...props, children: children.map(child => typeof child === "string" ? text(child) : child) } });
    };
}

export class CustomElementFactory extends HTMLElementFactory {

    constructor(
        public readonly baseType: HTMLElementName,
        public readonly tagName: string
    ) {
        super();
    }

    public createNode(ofType: HTMLElementName): NodeType<HTMLElementName> {
        const element = document.createElement(toLowerCase(this.baseType), { is: this.tagName }) as NodeType<HTMLElementName>;
        //  the browsers don't change the nodeName to match the tagName
        //  we want those to match up, so we override it.
        //  if we find this to make any problem in other browsers, we'll create a new named property.
        Object.defineProperty(element, "nodeName", { value: this.tagName });
        return element;
    }

}