import { requestFrame } from "../common/requestFrame.js";
import { NodeBuilder } from "./NodeBuilder.js";

export abstract class WebComponent extends HTMLElement {

    public hookIndex: number = 0;
    public readonly hooks: any[];

    constructor() {
        super();
        this.hooks = [];
        this.renderAndApply = this.renderAndApply.bind(this);
        console.log(`${this.tagName}.constructor`);
    }

    public invalidate() {
        requestFrame(this.renderAndApply);
        console.log(`${this.tagName}.invalidate`);
    }

    connectedCallback() {
        console.log(`${this.tagName}.connectedCallback`);
        this.invalidate();
    }

    disconnectedCallback() {
        console.log(`${this.tagName}.disconnectedCallback`);
    }

    attributeChangedCallback() {
        console.log(`${this.tagName}.attributeChangedCallback`);
        this.invalidate();
    }

    private renderAndApply() {
        console.log(`${this.tagName}.renderAndApply`);

        this.hookIndex = 0;
        WebComponent.renderStack.push(this);
        try {
            this.apply(this.render());
        }
        finally {
            WebComponent.renderStack.pop();
        }
    }

    apply(node: NodeBuilder) {
        node.apply(this);
    }

    abstract render(): NodeBuilder;

    private static renderStack: WebComponent[] = [];
    public static get current() {
        return this.renderStack[this.renderStack.length - 1];
    }

}
