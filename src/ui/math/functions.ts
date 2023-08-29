
export const epsilon = 0.000001

export function equivalent(a: number, b: number) {
    return Math.abs(a - b) <= epsilon * Math.max(1, Math.abs(a), Math.abs(b))
}

export function clamp(value: number, min: number = 0, max: number = 1) {
    return value < min ? min : value > max ? max : value
}

export function lerp(a: any, b: any, alpha = 0.5) {
    if (typeof a === "number") {
        return a * (1 - alpha) + b * alpha
    }
    return a.lerp(b, alpha)
}

export function easeInOutCubic(x: number) {
    return x ** 2 * 3 - x ** 3 * 2
}

export type RandomNumberGenerator = (min?: number, max?: number) => number

// Source: https://en.wikipedia.org/wiki/Xorshift
export function randomNumberGenerator(seed = Number.MAX_SAFE_INTEGER): RandomNumberGenerator {
    let x = seed
    let coef = 1 / (1 << 31)
    return function random(min = 0, max = 1) {
        x ^= x << 13
        x ^= x >> 7
        x ^= x << 17
        let r = Math.abs(x * coef)
        return min + r * (max - min)
    }
}