import { NodeBlueprint } from "../NodeBlueprint.js";
import { NodeChildName, NodeProperties } from "../NodeTypes.js";
import { HTMLElementName } from "./HTMLNodeFactory.js";

export function text(nodeValue: string): NodeBlueprint<"#text"> {
    return new NodeBlueprint("#text", { nodeValue });
}

function createBlueprintFactory<
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

export const element = createBlueprintFactory("HTMLELEMENT");
export const div = createBlueprintFactory("DIV");
export const span = createBlueprintFactory("SPAN");
export const input = createBlueprintFactory("INPUT");
export const button = createBlueprintFactory("BUTTON");
export const textArea = createBlueprintFactory("TEXTAREA");
export const p = createBlueprintFactory("P");
export const h1 = createBlueprintFactory("H1");
export const h2 = createBlueprintFactory("H2");
export const h3 = createBlueprintFactory("H3");
export const h4 = createBlueprintFactory("H4");
export const ol = createBlueprintFactory("OL");
export const ul = createBlueprintFactory("UL");
export const li = createBlueprintFactory("LI");

