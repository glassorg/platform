import { memoize } from "../../common/functions.js";
import { requestFrame } from "../../common/requestFrame.js";
import { INode } from "../INode.js";
import { NodeBlueprint } from "../NodeBlueprint.js";
import { NodeType } from "../NodeTypes.js";
import Invalidatable from "../graphics/Invalidatable.js";
import { HTMLElementName } from "./HTMLNodeFactory.js";
import "./HTMLNodeFactory.js"

abstract class AbstractRender<Name extends HTMLElementName> {
    abstract render(): NodeBlueprint<Name>;
}

export type WebComponent<Name extends HTMLElementName = HTMLElementName> = NodeType<Name> & HTMLElement & Invalidatable & AbstractRender<Name> & INode & {
    hookIndex: number;
    readonly hooks: any[];
};

export function isWebComponent(value): value is WebComponent {
    return typeof value.hookIndex === "number";
}

export const getWebComponentClass: <Name extends HTMLElementName>(tagName?: Name) => (new () => HTMLElement & Invalidatable) = memoize(
    <Name extends HTMLElementName>(tagName?: string) => {
        const baseClass = tagName
            ? document.createElement(tagName).constructor as any as typeof HTMLElement
            : HTMLElement;

        abstract class WebComponent extends baseClass {

            public hookIndex: number = 0;
            public readonly hooks: any[];

            constructor() {
                super();
                this.hooks = [];
                this.renderAndApply = this.renderAndApply.bind(this);
                // console.log(`${this.tagName}.constructor`);
            }

            public invalidate() {
                requestFrame(this.renderAndApply);
                // console.log(`${this.tagName}.invalidate`);
            }

            connectedCallback() {
                // console.log(`${this.tagName}.connectedCallback`);
                this.invalidate();
            }

            disconnectedCallback() {
                // console.log(`${this.tagName}.disconnectedCallback`);
            }

            attributeChangedCallback() {
                // console.log(`${this.tagName}.attributeChangedCallback`);
                this.invalidate();
            }

            private renderAndApply() {
                // console.log(`${this.tagName}.renderAndApply BEGIN`, this);

                this.hookIndex = 0;
                renderStack.push(this as any);
                try {
                    let blueprint = this.render();
                    blueprint.applyTo(this as unknown as NodeType<Name>);
                }
                finally {
                    renderStack.pop();
                    // console.log(`${this.tagName}.renderAndApply END`);
                }
            }

            abstract render(): NodeBlueprint<Name>;

        }
        return WebComponent as any;
    }
)

const renderStack: WebComponent[] = [];
export function getCurrentWebComponent() {
    return renderStack[renderStack.length - 1];
}
