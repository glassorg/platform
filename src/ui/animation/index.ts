import KeyFrameAnimation from "./KeyFrameAnimation.js"
import KeyFrame from "./KeyFrame.js"
import { getOperations } from "./Operations.js"

export type Animation<T> = (time: number) => T

type KeyFrameArray<T = number> = [number, T] | [number, T, "smooth" | "linear" | "none"]

export function fromKeyFrames<T>(frames: KeyFrame<T>[]): Animation<T> {
    return KeyFrameAnimation.create(frames)
}

export function fromArray<T>(frames: KeyFrameArray<T>[]): Animation<T> {
    return KeyFrameAnimation.create(frames.map(values => new (KeyFrame as any)(...values)))
}

export function constant<T>(a: T) {
    return (time: number) => a
}

export function scale<T>(a: Animation<T>, b: Animation<number>): Animation<T> {
    return (time: number) => {
        let aValue = a(time)
        let bValue = b(time)
        let ops = getOperations((aValue as any).constructor)
        return ops.scale(aValue, bValue)
    }
}

export function add<T>(...animations: Animation<T>[]): Animation<T> {
    return (time: number) => {
        let values = animations.map(a => a(time))
        let ops = getOperations((values[0] as any).constructor)
        return ops.add(...values)
    }
}

export function subtract<T>(a: Animation<T>, b: Animation<T>): Animation<T> {
    return (time: number) => {
        let aValue = a(time)
        let bValue = b(time)
        let ops = getOperations((aValue as any).constructor)
        return ops.subtract(aValue, bValue)
    }
}
