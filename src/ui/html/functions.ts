import { INode } from "../INode.js"
import Vector2 from "../math/Vector2.js"

export function getClientPosition(element: HTMLElement) {
    let bounds = element.getClientRects()[0]
    return new Vector2(bounds.left, bounds.top)
}

export function getPosition(e: MouseEvent, element: HTMLElement = e.target as HTMLElement) {
    let bounds = element.getClientRects()[0]
    return new Vector2(e.clientX - bounds.left, e.clientY - bounds.top)
}

export function isAncestorOrSelf(self: INode, possibleAncestor: INode) {
    for (let node: INode | null = self; node != null; node = node.parentNode) {
        if (node === possibleAncestor) {
            return true
        }
    }
    return false
}

export function getAncestor(element: HTMLElement, predicate: (ancestor: HTMLElement) => boolean) {
    for (let ancestor = element.parentElement; ancestor != null; ancestor = ancestor.parentElement) {
        if (predicate(ancestor)) {
            return ancestor
        }
    }
    return null
}

export function getFormValues(element: HTMLFormElement) {
    let values: any = {}
    // TODO: improve this to query from some class indicator of field
    for (let input of element.querySelectorAll("input")) {
        values[input.name || input.id] = input.value
    }
    return values
}


function isForm(element: HTMLElement) {
    return element instanceof HTMLFormElement
}

export function getAncestorForm(element: HTMLElement): HTMLFormElement | null {
    return getAncestor(element, isForm) as HTMLFormElement | null
}
