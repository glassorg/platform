import { NodeName, NodeProperties, NodeType } from "./NodeTypes.js";

export abstract class NodeFactory<Name extends NodeName = NodeName> {

    public abstract createNode(ofType: Name): NodeType<Name>;
    public apply(to: NodeType<Name>, properties: NodeProperties<Name>) {
        Object.assign(to, properties);
    }

    public static defaultFactory?: NodeFactory;
    private static factoryMap = new Map<string, NodeFactory>();
    public static registerFactory(names: ReadonlyArray<string>, factory: NodeFactory) {
        for (let name of names) {
            if (this.factoryMap.has(name)) {
                throw new Error(`Already registered: ${name}`);
            }
            this.factoryMap.set(name, factory);
        }
    }

    public static getFactory<Name extends NodeName>(name: Name): NodeFactory<Name> {
        const factory = this.factoryMap.get(name) ?? this.defaultFactory;
        if (!factory) {
            throw new Error(`No factory: ${name}`);
        }
        return factory as NodeFactory<Name>;
    }

    public static createNode<Name extends NodeName>(ofType: Name): NodeType<Name> {
        return this.getFactory(ofType).createNode(ofType);
    }

}
