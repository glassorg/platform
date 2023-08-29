import { SupportFunction } from "./gjkCommon.js"
import Vector3 from "../Vector3.js"
import Matrix4 from "../Matrix4.js"

export default {
    sum: (supports: any) => (v: any) => supports.map((s: any) => s(v)).reduce((a: any, b: any) => a.add(b)),
    diff: (a: SupportFunction, b: SupportFunction) => (v: Vector3) => a(v).subtract(b(v.negate())),
    cube: (s: any, bias = 1) => (v: any) => new Vector3(Math.sign(v.x) || bias, Math.sign(v.y) || bias, Math.sign(v.z) || bias).scale(s),
    line: (s: any) => (v: any) => new Vector3(Math.sign(v.x), 0, 0).scale(s),
    capsule: (a: Vector3, b: Vector3, radius: number) => (v: any) => {
        v = v.normalize().scale(radius)
        let aSupport = a.add(v)
        let bSupport = b.add(v)
        return aSupport.dot(v) > bSupport.dot(v) ? aSupport : bSupport
    },
    sphere: (s: any) => (v: any) => v.normalize().scale(s),
    cone: (s: any) => (v: any) => {
        let a = new Vector3(0, s, 0)
        let invRadius = 1 / Math.hypot(v.x, v.z)
        let b = new Vector3(v.x * invRadius, -1, v.z * invRadius).scale(s)
        return a.dot(v) > b.dot(v) ? a : b
    },
    cylinder: (s: any) => (v: any) => {
        let invRadius = 1 / Math.hypot(v.x, v.z)
        return new Vector3(v.x * invRadius, Math.sign(v.y), v.z * invRadius).scale(s)
    },
    rotate: (axis: Vector3, angle: number, support: SupportFunction) => (v: any) => {
        let pre = v.transform(Matrix4.rotation(axis, -angle))
        let preSupport = support(pre)
        return preSupport.transform(Matrix4.rotation(axis, angle))
    },
    translate: (translation: Vector3, support: SupportFunction) => (v: any) => support(v).add(translation),
    polyhedron: (vertices: any) => (v: any) => vertices.reduce((a: any, b: any) => b.dot(v) > a.dot(v) ? b : a),
}