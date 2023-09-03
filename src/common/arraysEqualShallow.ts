
export function arraysEqualShallow(a: any[], b: any[]) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function equalsShallow(a, b) {
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        return arraysEqualShallow(a, b);
    }
    return false;
}

//  quick, shallow comparison of object key/value pairs.
//  if values are arrays then they are shallowly compared.
export function objectsEqualShallow(a: object, b: object) {
    let checked = new Set<string>();
    for (let name in a) {
        if (!equalsShallow(a[name], b[name])) {
            return false;
        }
        checked.add(name);
    }
    for (let name in b) {
        if (!checked.has(name) && !equalsShallow(a[name], b[name])) {
            return false;
        }
    }
    return true;
}
