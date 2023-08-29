import { assignIfDifferent } from "../common/functions.js";
import { INode } from "./INode.js";
import { NodeWriter } from "./NodeWriter.js";
import { NodeType } from "./NodeType.js";

export class NodeBuilder<T = HTMLElement> {

    constructor(
        public readonly type: NodeType,
        public readonly properties: Record<string, any>,
        public readonly children: (NodeBuilder | string)[],
        public readonly style?: Partial<CSSStyleDeclaration>,
        public readonly attributes?: Attributes,
    ) {
    }

    apply(to: HTMLElement) {
        let pointer = new NodeWriter(to);
        function renderNode(builder: NodeBuilder) {
            const node = pointer.begin(builder.type);
            builder.applyProperties(node);
            for (let i = 0; i < builder.children.length; i++) {
                let child = builder.children[i];
                let node: INode;
                if (typeof child === "string") {
                    pointer.text(child);
                }
                else {
                    renderNode(child);
                }
            }
            pointer.end();
        }

        renderNode(this);

        // to.replaceChildren();
        // to.appendChild(this.toElement());

    }

    private applyProperties(to: INode) {
        if (to instanceof HTMLElement) {
            if (this.attributes) {
                for (let name in this.attributes) {
                    let value = this.attributes[name];
                    if (value === false) {
                        to.removeAttribute(name);
                    }
                    else {
                        to.setAttribute(name, value === true ? "" : value);
                    }
                }
            }
            if (this.style) {
                assignIfDifferent(to.style, this.style);
            }
        }
        if (this.properties) {
            assignIfDifferent(to, this.properties);
        }
    }

    private toElement() {
        const { type } = this;
        let element = typeof type === "function" ? new (type as any)() : document.createElement(type);
        this.applyProperties(element);
        if (this.children) {
            for (let child of this.children) {
                element.appendChild(typeof child === "string" ? document.createTextNode(child) : child.toElement());
            }
        }
        return element;
    }

}

//  Ideally, we can use a react hooks style pure functional component declaration.
//  with useState and useEffect
//  which are the most useful and only really necessary hooks.
//  initially we can just toss and re-render this to DOM.
//  then we can use the context style approach to do our rendering.

type Attributes = Record<string, string | boolean>;
type PropertiesAndAttributes<T> = object & Partial<Omit<T, "attributes" | "style"> & {
    class: string,
    style: Partial<CSSStyleDeclaration>,
    attributes: Attributes
}>;
function isPropertiesAndAttributes<T>(value?: unknown): value is PropertiesAndAttributes<T> {
    return value != null && typeof value === "object" && !(value instanceof NodeBuilder);
}
export function element<E extends { className?: string }, C extends string | NodeBuilder = string | NodeBuilder>(typeName: string) {
    function create(
        ...children: C[]
    ): NodeBuilder<E>
    function create(
        props?: PropertiesAndAttributes<E>,
        ...children: C[]
    ): NodeBuilder<E>
    function create(
        props?: PropertiesAndAttributes<E> | C,
        ...children: C[]
    ) {
        if (isPropertiesAndAttributes<E>(props)) {
            const { class: className, style, attributes, ...properties } = props;
            if (className) {
                properties.className = className;
            }
            return new NodeBuilder(typeName, properties, children, style, attributes);
        }
        else {
            return new NodeBuilder(typeName, {}, [props as C, ...children]);
        }
    };

    return create;
}

export const div = element<HTMLDivElement>("div");
export const span = element<HTMLSpanElement>("span");
export const input = element<HTMLInputElement, never>("input");
export const button = element<HTMLButtonElement>("button");
export const textArea = element<HTMLTextAreaElement>("textarea");
export const h1 = element<HTMLHeadingElement>("h1");
export const h2 = element<HTMLHeadingElement>("h2");
export const h3 = element<HTMLHeadingElement>("h3");
export const h4 = element<HTMLHeadingElement>("h4");
export const ol = element<HTMLOListElement, NodeBuilder<HTMLLIElement>>("ol");
export const ul = element<HTMLUListElement, NodeBuilder<HTMLLIElement>>("ul");
export const li = element<HTMLLIElement>("li");
