import Vector3 from "./Vector3.js"
export default interface ISupported {
    // Returns the furthest point along a direction.
    support(v: Vector3): Vector3
}