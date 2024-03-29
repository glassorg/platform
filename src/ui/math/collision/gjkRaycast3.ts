import Vector3 from "../Vector3.js";
import { SupportFunction, nonMultiple, checkEdge, normalForEdge, checkFace, checkTriangleEdge, normalForFace, raycastTriangle } from "./gjkCommon.js";
import { randomNumberGenerator } from "../functions.js";

// This method projects a 3D shape onto a plane normal to 'heading', and passing through the origin. It then performs 2D GJK on this shape.
// If this finds a triangle containing the ray origin, then the ray passes through the 3D shape.
export function silhouetteGjk(support: SupportFunction, heading: Vector3, debug?: any) {
    function project(vector: Vector3) { return heading.rejection(vector) }
    const random = randomNumberGenerator()
    const maxIterations = 10
    let initialHeading = project(nonMultiple(heading, random))
    let initialPoint = support(initialHeading)
    let searchDirection = project(initialPoint.negate())
    let simplex: Vector3[] = [initialPoint]

    if (debug)
        debug.simplices = []

    function checkAndUpdateSimplex() {
        if (debug)
            debug.simplices.push(simplex.slice())

        switch (simplex.length) {

            case 1: {
                searchDirection = project(simplex[0].negate())
                return false
            }

            case 2: {
                let [b, a] = simplex
                let pb = project(b)
                let pa = project(a)
                if (checkEdge(pa, pb)) {
                    searchDirection = normalForEdge(pa, pb)
                } else {
                    searchDirection = pa.negate()
                    simplex = [a]
                }
                return false
            }

            case 3: {
                let [c, b, a] = simplex
                let pc = project(c)
                let pb = project(b)
                let pa = project(a)
                if (checkFace(pa, pb, pc)) {
                    return true
                } else if (checkTriangleEdge(pa, pb, pc)) {
                    searchDirection = normalForEdge(pa, pb)
                    simplex = [b, a]
                } else if (checkTriangleEdge(pa, pc, pb)) {
                    searchDirection = normalForEdge(pa, pc)
                    simplex = [c, a]
                } else {
                    searchDirection = pa.negate()
                    simplex = [a]
                }
                return false
            }
        }
    }

    let i = 0
    while (true) {
        if (++i > maxIterations)
            return null
        if (searchDirection.equivalent(Vector3.zero))
            searchDirection = project(nonMultiple(heading, random))
        let nextVertex = support(searchDirection)
        if (nextVertex.dot(searchDirection) < 0)
            return null
        simplex.push(nextVertex)
        let intersected = checkAndUpdateSimplex()
        if (intersected)
            return simplex
    }
}

// gjkRaycast3 returns the time and normal at which the input ray hits the input geometry, given as a support function.
// It starts by finding an initial triangle contained by the input geometry which the ray passes through.
// It approaches the collision point by extending the current triangle into a tetrahedron in the direction of the origin.
// The next triangle is selected from the 3 new faces of the tetrahedron, whichever one intersects the ray.
// The number of reachable faces triples every iteration, meaning even smooth geometry can be tested in relatively few iterations.
export default function gjkRaycast3(support: SupportFunction, heading: Vector3, debug?: any) {
    const maxIterations = 10

    // Returns an arbitrary triangle in the input shape which the ray passes through.
    let simplex = silhouetteGjk(support, heading, debug)
    if (!simplex)
        return null


    let i = 0
    while (true) {
        let [a, b, c] = simplex as Vector3[]

        let collision = () => {
            let time = raycastTriangle(Vector3.zero, heading, a, b, c) as number
            return { time, normal }
        }

        let normal = normalForFace(a, b, c)
        let d = support(normal)

        // if (debug)
        //     debug.simplices.push([a, b, c, d])

        if ((++i > maxIterations) || d.equivalent(a) || d.equivalent(b) || d.equivalent(c))
            return collision()

        let faces = [
            [d, b, c],
            [a, d, c],
            [a, b, d],
        ]

        let success = false
        for (let face of faces) {
            let [a, b, c] = face
            try {
                if (raycastTriangle(Vector3.zero, heading, a, b, c) !== null) {
                    simplex = face
                    success = true
                    break
                }
            } catch (e) {
                // Couldn't invert matrix, raytrace failed.
            }
        }

        if (!success)
            return collision()

    }
}
