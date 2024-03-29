import { MyClassElement } from "../../../web/MyClassElement.js";
import { assignIfDifferent } from "../../common/functions.js";
import { INode } from "../INode.js";
import { NodeFactory } from "../NodeFactory.js";
import { HTMLButtonProperties, HTMLElementProperties, HTMLInputProperties, HTMLTextAreaProperties, NodeName, NodeNameToType, NodeProperties, NodeType } from "../NodeTypes.js";

export class HTMLElementFactory extends NodeFactory<HTMLElementName> {

    public createNode(ofType: HTMLElementName): NodeType<HTMLElementName> {
        return document.createElement(ofType.toLowerCase()) as NodeType<HTMLElementName>;
    }

    public override apply(to: NodeType<HTMLElementName>, { style, ...properties }: NodeProperties<HTMLElementName>): void {
        assignIfDifferent(to.style, style);
        assignIfDifferent(to, properties);
    }

    public static readonly instance = new HTMLElementFactory();

}

export class TextFactory extends NodeFactory<"#text"> {

    public createNode(ofType: "#text"): NodeType<"#text"> {
        return new Text() as NodeType<"#text">;
    }

    public override apply(to: NodeType<"#text">, { nodeValue }: NodeProperties<"#text">): void {
        if (to.nodeValue !== nodeValue) {
            to.nodeValue = nodeValue;
        }
    }

    public static readonly instance = new TextFactory();

}

export class AbstractElementFactory extends NodeFactory {

    public createNode<Name extends keyof NodeNameToType>(ofType: Name): NodeType<Name> {
        throw new Error();
    }

    public static readonly instance = new AbstractElementFactory();

}


export const htmlElementNames = [
    "HTMLELEMENT",
    "A", "SPAN", "CANVAS", "DIV", "INPUT", "TEXTAREA", "BUTTON", "P", "SELECT", "UL", "OL", "LI", "HR", "H1", "H2", "H3", "H4", "H5", "H6"
] as const satisfies ReadonlyArray<NodeName>;

export type HTMLElementName = (typeof htmlElementNames)[number];

NodeFactory.defaultFactory = HTMLElementFactory.instance;
// NodeFactory.registerFactory(htmlElementNames, HTMLElementFactory.instance);
NodeFactory.registerFactory(["#text"], TextFactory.instance);
NodeFactory.registerFactory(["HTMLELEMENT"], AbstractElementFactory.instance);

