import { NodeBlueprint } from "../NodeBlueprint.js";
import { NodeChildName, NodeProperties } from "../NodeTypes.js";
import { HTMLElementName } from "./HTMLNodeFactory.js";

export function text(nodeValue: string): NodeBlueprint<"#text"> {
    return new NodeBlueprint("#text", { nodeValue });
}

export function element<
    Name extends HTMLElementName,
>(type: Name) {
    function create(properties?: NodeProperties<Name>, ...children: (string | NodeBlueprint<NodeChildName<Name>>)[]): NodeBlueprint<Name>
    function create(...children: (string | NodeBlueprint<NodeChildName<Name>>)[]): NodeBlueprint<Name>
    function create(propertiesOrFirstChild?: NodeProperties<Name> | string | NodeBlueprint<NodeChildName<Name>>, ...otherChildren: (string | NodeBlueprint<NodeChildName<Name>>)[]) {
        let properties: NodeProperties<Name> | undefined;
        let children: NodeBlueprint<NodeChildName<Name>>[] | undefined;
        if (propertiesOrFirstChild instanceof NodeBlueprint || typeof propertiesOrFirstChild === "string") {
            otherChildren.unshift(propertiesOrFirstChild);
        }
        else {
            properties = propertiesOrFirstChild;
        }
        for (let child of otherChildren) {
            if (!children) {
                children = [];
            }
            children.push(typeof child === "string" ? text(child) as NodeBlueprint<NodeChildName<Name>> : child);
        }
        return new NodeBlueprint(type, properties, children);
    }
    return create;
}

export const div = element("DIV");
export const span = element("SPAN");
export const input = element("INPUT");
export const button = element("BUTTON");
export const textArea = element("TEXTAREA");
export const h1 = element("H1");
export const h2 = element("H2");
export const h3 = element("H3");
export const h4 = element("H4");
export const ol = element("OL");
export const ul = element("UL");
export const li = element("LI");

