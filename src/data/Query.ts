import { Type, IndexedProperties, Schema } from "./Schema.js";
import { DeepReadonly, Simplify, StringKeyof } from "../common/types.js";

export const operators = {
    "<": <T extends number | string>(a: T | T[], b: T) => Array.isArray(a) ? a.some(a => a < b) : a < b,
    ">": <T extends number | string>(a: T | T[], b: T) => Array.isArray(a) ? a.some(a => a > b) : a > b,
    "<=": <T extends number | string>(a: T | T[], b: T) => Array.isArray(a) ? a.some(a => a <= b) : a <= b,
    ">=": <T extends number | string>(a: T | T[], b: T) => Array.isArray(a) ? a.some(a => a >= b) : a >= b,
    "==": <T extends number | string | boolean>(a: T | T[], b: T) => Array.isArray(a) ? a.includes(b) : a == b,
    "!=": <T extends number | string | boolean>(a: T | T[], b: T) => Array.isArray(a) ? !a.includes(b) : a != b,
    "contains": <T extends string | number>(a: T[], b: T) => a.includes(b),
} as const satisfies Record<string, (a: any, b: any) => boolean>;

type Operators = typeof operators;
type Operator = StringKeyof<typeof operators>;
type ValidOperations<T> = { [OP in Operator]: T extends Parameters<Operators[OP]>[0] ? OP : never }[Operator];
type Scalar<T> = T extends Array<infer I> ? I : T;

export type Constraints<T> = Readonly<{
    [K in StringKeyof<T>]?:
    T[K]
    | { [O in ValidOperations<T[K]>]?: Scalar<T[K]> }
}>;

export type Sort<T extends string> = Simplify<Readonly<{
    [K in T]?: boolean;
}>>;

export type Indexes<S extends Schema> = keyof IndexedProperties<S>;
export type Select<S extends Schema> = Readonly<Array<keyof Type<S>>>;

export type Query<
    S extends Schema,
    T = Type<S>,
    P extends ReadonlyArray<keyof T> = ReadonlyArray<keyof T>,
    ID extends string = S["id"],
> = DeepReadonly<{
    type: ID;
    sort?: Sort<Indexes<S>>;
    where?: Constraints<IndexedProperties<S>>;
    offset?: number;
    count?: number;
    select?: P;
}>;

export type SelectQuery<S extends Schema, T = Type<S>, P extends ReadonlyArray<keyof T> = ReadonlyArray<keyof T>>
    = Query<S, T, P> & Readonly<{ select: P }>

export function doesDocumentSatisfyConstraints<S extends Schema>(record: any, constraints?: Constraints<IndexedProperties<S>>) {
    if (constraints) {
        for (let [name, value] of Object.entries(constraints)) {
            if (value != null && typeof value === "object") {
                for (let [op, opValue] of Object.entries(value)) {
                    if (!(operators[op as Operator] as any)(record[name], opValue)) {
                        return false;
                    }
                }
            }
            else
                if (!operators["=="](record[name], value as any)) {
                    return false;
                }
        }
    }
    return true;
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
