
export function clone(target: any) {
    if (target) {
        if (Array.isArray(target)) {
            return [...target];
        }
        if (typeof target === "object") {
            return { ...target };
        }
    }
    return target;
}

export function isAlreadySorted(array: any[]) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[i - 1]) {
            return false;
        }
    }
    return true;
}

export function normalizeKeyOrder(target: any) {
    if (!target || typeof target !== "object" || Array.isArray(target)) {
        return target;
    }
    let keys = Object.keys(target)
    if (isAlreadySorted(keys)) {
        return target;
    }
    keys = keys.sort();
    let result: any = {};
    for (let key of keys) {
        result[key] = target[key];
    }
    return result;
}

export function mergePatch(target: any, patch: any) {
    if (patch === null) {
        //  delete target
        return null;
    }
    if (target == null || typeof patch !== "object" || Array.isArray(patch)) {
        return target;
    }
    let result: any = null;
    for (let name in patch) {
        let oldValue = target[name];
        let newValue = patch[name];
        if (oldValue !== newValue) {
            if (!result) {
                result = clone(target);
            }
            result[name] = newValue;
        }
    }
    return result ?? target;
}