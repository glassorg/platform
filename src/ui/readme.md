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
[x] NodeFactory: Constructs nodes from NodeBlueprints.
[x] Proper type checking of `this` value within functional custom elements.
[x] Constrain return type of functional render handler to be same type as element base.
[x] Connected/Disconnected events
[x] Connected/Disconnected hooks
[x] Events handling and data typing?
[x] Make SceneNode Factory and register
[x] Change Node to SceneNode
[/] Make some 2d rendering work in the graphicsCanvas
[x] Get invalidation/re-rendering working.
[ ] Convert tagName map back to lower case?
[ ] Need ability to write customSceneNode, similar to customElement with hooks.
[x] Invalidate for re-create component function vs invalidate for request re-render.
[x] isConnected on VirtualNode... not high performance.
[x] VirtualNode extends EventSource/Target
[ ] Convert to NodeBuilder classes.
