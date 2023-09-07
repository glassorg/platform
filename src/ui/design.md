
Using JSON for the NodeBlueprints with the indirection to the NodeFactory and advanced Type descriptions... seems too complicated.
We have no requirements to make the NodeBlueprints json serializable, so they can be classes/subclasses.

```typescript
    class NodeBuilder<T extends DOMNode> {
        apply(target?: T): T;
    }
```

- Type specific NodeBuilders, HTMLTextBuilder, HTMLElementBuilder, CustomElementBuilder, GraphicNodeBuilder
- helper functions for concisely creating Builders, -> div({ className: "Foo" }) vs new HTMLElementBuilder("div", { className: "Foo" })
