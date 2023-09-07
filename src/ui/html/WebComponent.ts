import { memoize } from "../../common/functions.js";
import { requestFrame, unrequestFrame } from "../../common/requestFrame.js";
import { INode } from "../INode.js";
import { NodeBlueprint } from "../NodeBlueprint.js";
import { NodeName, NodeType } from "../NodeTypes.js";
import Invalidatable from "../graphics/Invalidatable.js";

abstract class AbstractRender<Name extends NodeName> {
    abstract render(): NodeBlueprint<Name>;
}

export type WebComponent<Name extends NodeName = NodeName> = NodeType<Name> & Invalidatable & AbstractRender<Name> & INode & {
    hookIndex: number;
    readonly hooks: any[];
};

export function isWebComponent(value): value is WebComponent {
    return typeof value.hookIndex === "number";
}
export const getWebComponentClass: <Base extends (new () => INode) >(baseClass: Base) => (new () => InstanceType<Base> & Invalidatable) = memoize(
    <Base extends (new () => INode)>(baseClass) => {
        abstract class WebComponent extends baseClass {

            public hookIndex: number = 0;
            public readonly hooks: any[];

            constructor() {
                super();
                this.hooks = [];
                this.renderAndApply = this.renderAndApply.bind(this);
            }

            public invalidate() {
                requestFrame(this.renderAndApply);
                // console.log(`${this.tagName}.invalidate`);
            }

            connectedCallback() {
                // console.log(`${this.tagName}.connectedCallback`);
                this.invalidate();
                this.dispatchEvent(new CustomEvent("connected", { bubbles: false }));
            }

            disconnectedCallback() {
                // console.log(`${this.tagName}.disconnectedCallback`);
                unrequestFrame(this.renderAndApply);
                this.dispatchEvent(new CustomEvent("disconnected", { bubbles: false }));
            }

            attributeChangedCallback() {
                // console.log(`${this.tagName}.attributeChangedCallback`);
                this.invalidate();
            }

            private renderAndApply() {
                if (!this.isConnected) {
                    return;
                }
                // console.log(`${this.tagName}.renderAndApply BEGIN`, this);

                this.hookIndex = 0;
                renderStack.push(this as any);
                try {
                    let blueprint = this.createBlueprints();
                    blueprint.applyTo(this as any);
                }
                finally {
                    renderStack.pop();
                    // console.log(`${this.tagName}.renderAndApply END`);
                }
            }

            abstract createBlueprints(): NodeBlueprint;

        }
        return WebComponent as any;
    }
)

export const getWebComponentClassByNodeName: <Name extends NodeName>(nodeName?: Name) => (new () => INode & Invalidatable) = memoize(
    <Name extends NodeName>(nodeName?: string) => {
        const baseClass = nodeName
            ? document.createElement(nodeName).constructor as any as typeof HTMLElement
            : HTMLElement;

        return getWebComponentClass(baseClass as any);
    }
)

const renderStack: WebComponent[] = [];
export function getCurrentWebComponent() {
    return renderStack[renderStack.length - 1];
}

declare global {
    interface GlobalEventHandlersEventMap {
        connected: Event;
        disconnected: Event;
    }
}
