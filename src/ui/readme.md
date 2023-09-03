# Web component and UI directory.

TODO:
[x] Figure out how to handle children in the custom elements.
[x] Reassign to components without destroying them.
[x] Rendering text nodes.
[x] Smart invalidate of components when properties change.
[ ] Write WebComponents that extend a specific component type.

## Nodes, Elements, Components and Semantics

[x] Node: A native document object model Node.
[x] INode: Node interface.
[x] Element: A native visual Element that extends Node.
[ ] IElement: Element interface.
[x] HTMLElement: A native HTML Element that extends Element.
[x] CustomElement: A custom class that extends a native (HTML) Element subclass and implements Component.
[ ] VirtualNode: A virtual node that implements INode and can be added as subnodes to Canvas.
[ ] VirtualElement: A virtual visual element that implements IElement and can be added as subnodes to Canvas.
[ ] Component: A smart Node that actively manages it's own properties and children.
    [x] Set .properties on it that contains { children: BluePrint[] }
    [-] or .blueprint?

[x] NodeBlueprint: Describes a node type, properties, events and children.
    [ ] Events?
[x] NodeFactory: Constructs nodes from NodeBlueprints.

