import { NodeBuilder } from "./NodeBuilder.js";

export abstract class WebComponent extends HTMLElement {

    public hookIndex: number = 0;
    public readonly hooks: any[];

    constructor() {
        super();
        this.hooks = [];
    }

    public invalidate() {
        // for now just immediately rerender.
        this.renderAndApply();
    }

    connectedCallback() {
        this.renderAndApply();
    }

    disconnectedCallback() {
    }

    attributeChangedCallback() {
        this.renderAndApply();
    }

    private renderAndApply() {
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
