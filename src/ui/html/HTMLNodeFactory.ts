import { assignIfDifferent } from "../../common/functions.js";
import { NodeFactory } from "../NodeFactory.js";
import { NodeName, NodeNameToType, NodeProperties, NodeType } from "../NodeTypes.js";

export class HTMLElementFactory extends NodeFactory<HTMLElementName> {

    public createNode(ofType: HTMLElementName): NodeType<HTMLElementName> {
        return document.createElement(ofType) as NodeType<HTMLElementName>;
    }

    public override apply(to: NodeType<HTMLElementName>, { style, ...properties }: NodeProperties<HTMLElementName>): void {
        assignIfDifferent(to.style, style);
        assignIfDifferent(to, properties);
    }

    public static readonly instance = new HTMLElementFactory();

}

export class TextFactory extends NodeFactory {

    public createNode<Name extends keyof NodeNameToType>(ofType: Name): NodeType<Name> {
        return new Text() as NodeType<Name>;
    }

    public static readonly instance = new TextFactory();

}

export const htmlElementNames = ["A", "SPAN", "DIV", "INPUT", "TEXTAREA", "BUTTON", "P", "SELECT", "UL", "OL", "LI", "HR", "H1", "H2", "H3", "H4", "H5", "H6"
] as const satisfies ReadonlyArray<NodeName>;

export type HTMLElementName = (typeof htmlElementNames)[number];

NodeFactory.defaultFactory = HTMLElementFactory.instance;
// NodeFactory.registerFactory(htmlElementNames, HTMLElementFactory.instance);
NodeFactory.registerFactory(["#text"], TextFactory.instance);

