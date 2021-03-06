import Key, { ModelKey } from "../../data/Key"
import Dependent from "../../data/Dependent"
import Store from "../../data/Store"
import { Schema } from "../../data/schema"
import Vector2 from "../math/Vector2"
import Patch from "../../data/Patch"
import clonePatch from "../../utility/clonePatch"
import Point from "./Point"
import Vector3 from "../math/Vector3"

const maxPoints = 200

function updatePointer(e: PointerEvent) {
    if (e.buttons > 0) {
        let id = e.pointerId
        let type = e.pointerType as any
        let isPrimary = e.isPrimary
        let key = Key.create(PointerState, id.toString())
        let point = new Point(e)
        let state = Store.default.peek(key)
        let points = [...state.points, point]
        let trim = points.length - maxPoints
        if (trim > 0) {
            // trim it down, but always leave the first point.
            points.splice(1, trim)
        }
        Store.default.patch(key, { id, type, isPrimary, points })
    }
}

function cancelPointer(e: PointerEvent) {
    let key = Key.create(PointerState, e.pointerId.toString())
    Store.default.delete(key)
}

let watching = false

@Dependent.class()
export default class PointerState extends Dependent {

    @Dependent.property({ default: 0 })
    id!: number

    @Dependent.property({ default: "mouse" })
    type!: "mouse" | "pen" | "touch"

    @Dependent.property({ default: true })
    isPrimary!: boolean

    @Dependent.property({ required: true, type: "array", default: [] })
    points!: Point[]

    @Dependent.property({ default: null, description: `
        The id of the gesture for handling this pointers input.
    ` })
    handler!: string | null

    get first() {
        return this.points[0]
    }

    get last() {
        return this.points[this.points.length - 1]
    }

    /**
     * Returns the closest Point at a given offset along the path.
     * @param offset If positive then distance from first otherwise from last.
     */
    getPointByDistance(offset): Point {
        let { points } = this
        let start = offset >= 0 ? 0 : points.length - 1
        let finish = offset >= 0 ? points.length : -1
        let step = offset >= 0 ? 1 : -1
        let distance = 0
        let lastPoint: Point | null = null
        for (let i = start; i !== finish; i += step) {
            let point = points[i]
            if (lastPoint != null) {
                distance += lastPoint.position.subtract(point.position).length()
            }
            if (distance >= Math.abs(offset)) {
                return point
            }
            lastPoint = point;
        }
        return lastPoint!
    }

    get key() {
        return Key.create(PointerState, this.id.toString())
    }

    /**
     * Returns a unit Vector2 pointing in the direction from the start to the last point.
     */
    get direction() {
        return this.last.position.subtract(this.first.position).normalize()
    }

    /**
     * Returns the distance as the crow flies from the start to the last point.
     */
    get distance() {
        return this.last.position.subtract(this.first.position).length()
    }

    /**
     * Returns the total distance from start to finish following through all of the points.
     */
    get length() {
        let length = 0
        let lastPosition: Vector2 | null = null
        for (let { position } of this.points) {
            if (lastPosition != null) {
                length += position.subtract(lastPosition).length()
            }
            lastPosition = position
        }
        return length
    }

    /**
     * Returns the total time from start to finish of this path.
     */
    get duration() {
        return this.last.time - this.first.time
    }

    getPreviousPoint(secondsAgo: number) {
        let time = this.last.time - secondsAgo
        for (let i = this.points.length - 1; i >= 0; i--) {
            let point = this.points[i]
            if (point.time < time) {
                return point
            }
        }
        return this.first
    }

    /**
     * Calculates the rectangular bounds of this pointers full history in a linear time operation.
     */
    getBounds() {
        return Vector2.getBounds(this.points.map(p => p.position))
    }

    patch(delta: Patch<PointerState>) {
        let patched = clonePatch(this, delta)
        if (patched !== this) {
            Store.default.patch(this.key, patched)
        }
        return patched
    }

    /**
     * Gets the pointer state for a given pointer after ensuring the internal state is updated.
     */
    static forEvent(e: PointerEvent) {
        updatePointer(e)
        let key = Key.create(PointerState, e.pointerId.toString())
        return Store.default.get(key)
    }

    static watched(key: ModelKey<PointerState>) {
        if (!watching) {
            watching = true
            let element = window.document
            element.addEventListener("pointerdown", updatePointer)
            element.addEventListener("pointermove", updatePointer)
            element.addEventListener("pointerup", cancelPointer)
            element.addEventListener("pointercancel", cancelPointer)
            return () => {
                element.removeEventListener("pointerdown", updatePointer)
                element.removeEventListener("pointermove", updatePointer)
                element.removeEventListener("pointerup", cancelPointer)
                element.removeEventListener("pointercancel", cancelPointer)
                watching = false
            }
        }
        else {
            return () => {}
        }
    }

    static readonly all = Key.create(PointerState, {})

}