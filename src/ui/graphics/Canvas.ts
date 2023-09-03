import Vector3 from "../math/Vector3.js"
import { getPosition } from "../html/functions.js"
import Capsule from "../math/Capsule.js"
import Sphere from "../math/Sphere.js"
import Node from "./scene/Node.js"
import Graphics from "./Graphics.js"
import Graphics2D from "./Graphics2D.js"
import Graphics3D from "./Graphics3D.js"
import { layout } from "./scene/Dock.js"
import { extendElementAsVirtualNodeRoot } from "../temporary/VirtualNode.js"

function bindPointerEvents(canvas: HTMLCanvasElement) {
    let pointerTarget: Node | null = null
    function pick(e: PointerEvent) {
        let firstChild = canvas.firstChild
        if (firstChild instanceof Node) {
            let position = getPosition(e)
            let front = new Vector3(position.x, position.y, 0)
            let back = new Vector3(position.x, position.y, 1)
            let ray = new Capsule(new Sphere(front, 0), new Sphere(back, 0))
            let picked = firstChild.pick(ray)
            // console.log("picked: ", picked ? { id: picked.node.id, x: picked.position.x, y: picked.position.y } : null)
            let pickedNode = picked ? picked.node : null
            if (pointerTarget !== pickedNode) {
                if (pointerTarget && pointerTarget.onpointerout) {
                    pointerTarget.onpointerout(e)
                }
                pointerTarget = pickedNode
                if (pointerTarget && pointerTarget.onpointerover) {
                    pointerTarget.onpointerover(e)
                }
            }
            return pointerTarget
        }
        return null
    }

    // add some event routing
    for (let event of ["pointerdown", "pointerup", "pointermove"]) {
        canvas.addEventListener(event, (e: any) => {
            // bubble these events
            let eventHandlerName = `on${event}`
            for (let target: any = pick(e); target instanceof Node; target = target.parentNode) {
                target[eventHandlerName]?.(e)
            }
        })
    }
}

function ensureRootRepaintableVirtualNode(canvas: HTMLCanvasElement, dimensions: 2 | 3) {

    bindPointerEvents(canvas)

    let graphics: Graphics
    function repaint() {
        rafId = null
        if (graphics == null) {
            if (dimensions === 2) {
                let context = canvas.getContext("2d")
                if (context instanceof CanvasRenderingContext2D) {
                    graphics = new Graphics2D(context)
                } else {
                    console.error(`Expectd a CanvasRenderingContext2D:`, context)
                }
            } else {
                let context = canvas.getContext("webgl2")
                if (context instanceof WebGL2RenderingContext) {
                    graphics = new Graphics3D(context)
                } else {
                    console.error(`Expectd a WebGL2RenderingContext:`, context)
                }
            }
        }
        if (graphics != null) {
            let time = Date.now()
            frame++
            if (start == null) {
                start = time
            }
            graphics.time = (time - start) / 1000
            // layout any children using the Dock layout.
            let animating = false
            graphics.begin()
            layout(canvas as any)
            for (let node: any = canvas.firstChild; node != null; node = node.nextSibling) {
                if (node instanceof Node) {
                    if (node.update(graphics)) {
                        animating = true
                    }
                }
            }
            for (let node: any = canvas.firstChild; node != null; node = node.nextSibling) {
                if (node instanceof Node) {
                    node.render(graphics)
                }
            }
            graphics.end()
            isDirty = false
            if (animating) {
                (canvas as any).isDirty = true
            }
        }
    }
    let isDirty = false
    let start: number | null = null
    let frame = 0
    let frameStart: number | null = null
    let rafId: number | null = null
    Object.defineProperties(extendElementAsVirtualNodeRoot(canvas), {
        isDirty: {
            get() { return isDirty },
            set(value: boolean) {
                if (value !== isDirty) {
                    isDirty = value
                    if (value && rafId == null) {
                        //  was using c.requestAnimationFrame
                        //  wasn't firing the first time on rendering repaint
                        rafId = requestAnimationFrame(repaint)
                    }
                }
            }
        }
    })
    return repaint
}

// export const graphicsCanvas = component(
//     (props: {
//         dimensions?: 2 | 3,
//         width?: number,
//         height?: number,
//         class?: string,
//         style?: CSSStyleDeclaration,
//         children: NodeBuilder[] }) => {
//         const { children } = props ?? { name: "unloaded", children: [] };
//         return (
//             div({ style: { color: "purple" } },
//                 `Hello ${name}! `,
//                 div({ style: { color: "red" } }, ...children),
//             )
//         );
//     }, "hello-component"
// );

// export default Context.component(function Canvas(c: Context, p: {
//     id?: string,
//     dimensions?: 2 | 3,
//     content: (c: Context) => void,
//     class?: string,
//     style?: string
// }) {
//     let { dimensions, content, ...rest } = p
//     let canvas: any = c.begin(html.canvas, rest)
//     let repaint = ensureRootRepaintableVirtualNode(c, canvas, dimensions = dimensions || 2)
//     content(c)
//     canvas.isDirty = true
//     c.end(html.canvas)
// })
