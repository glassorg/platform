import { Results } from "./DataSource.js";
import { Patch } from "./Patch.js";
import { Constraints, Indexes, Sort, doesRecordSatisfyConstraints } from "./Query.js";
import { Schema, Type } from "./Schema.js";

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

export function mergePatch(target: any, patch: any, preserveNulls = false, mutateTarget = false) {
    if (patch === undefined) {
        return target;
    }
    if (patch === null) {
        //  delete target
        return null;
    }
    if (target == null || typeof patch !== "object" || Array.isArray(patch)) {
        return patch;
    }
    let result: any = null;
    for (let name in patch) {
        let oldValue = target[name];
        let newValue = patch[name];
        if (oldValue !== newValue) {
            if (!result) {
                result = mutateTarget ? target : clone(target);
            }
            if (newValue == null && !preserveNulls) {
                delete result[name];
            }
            else {
                result[name] = mergePatch(oldValue, newValue, preserveNulls, false /* mutation never recurses */);
            }
        }
    }
    return result ?? target;
}

export function filterRecords<S extends Schema>(records: Results<Type<S>>, constraints?: Constraints<unknown>): Results<Type<S>> {
    const results: Results<Type<S>> = {};
    for (let [key, value] of Object.entries(records)) {
        if (doesRecordSatisfyConstraints(value as any, constraints)) {
            results[key] = value;
        }
    }
    return results;
}

export function createSortFunction<S extends Schema, T extends Type<S> = Type<S>>(sort: Sort<Indexes<S>>) {
    return (a: any, b: any) => {
        for (let [property, direction] of Object.entries(sort)) {
            let order = compare(a[property], b[property]);
            if (order !== 0) {
                return direction ? order : -order;
            }
        }
        return 0;
    }
}

export function compare(a: any, b: any) {
    if (a === b) {
        return 0;
    }
    if (a == null) {
        return -1;
    }
    if (b == null) {
        return +1;
    }
    return a < b ? -1 : +1;
}

export function getFilteredPatch(records: Results, patch: Patch<any>, constraints: Constraints<unknown>) {
    const filteredPatch: Patch<any> = {};

    //  if child *becomes* filtered out, remove
    //  if child *becomes* filters in, add
    for (let [key, recordPatch] of Object.entries(patch)) {
        let before = records[key];
        let after = mergePatch(records[key], recordPatch);
        let beforePass = doesRecordSatisfyConstraints(before, constraints);
        let afterPass = doesRecordSatisfyConstraints(after, constraints);
        if (beforePass && !afterPass) {
            //  was in but not now -> remove
            filteredPatch[key] = null;
        }
        else if (!beforePass && afterPass) {
            //  was not in but now is -> add
            filteredPatch[key] = after;
        }
        else if (beforePass && afterPass) {
            //  was in before and is still in -> normal patch
            filteredPatch[key] = recordPatch;
        }
        else {
            // was not in before and still not -> ignore
        }
    }

    return filteredPatch;
}
export function getPrimaryKey({ primaryKeys }: Schema, record: any): any {
    return primaryKeys.length === 1 ? (record as any)[primaryKeys[0] as any] : primaryKeys.map(name => (record as any)[name]).join(",");
}
