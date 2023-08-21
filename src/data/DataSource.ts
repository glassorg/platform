import { Patch } from "./Patch.js";

export type Watcher<T = unknown> = (patch: Patch<T>) => void;
export type Unwatch = () => void;
export type Request<T extends string = string> = { type: T };
export type Results<T = unknown> = Record<string, T>;

export interface DataSource<T extends string = string> {
    type?: T;
    watch(request: Request<T>, watcher: Watcher<Results>): Unwatch;
    patch?(request: Request<T>): void;
    applyPatchesAndNotify(): void;
}

export type DataSourceWithTypeFunctions<DS extends DataSource> =
    DS extends DataSource<infer T> ?
    {
        [P in keyof DS]: WithType<DS[P], T>;
    } : never;

export type WithType<F, T> =
    F extends (a: infer A, ...b: (infer B)) => infer C ?
    (a: A & { type: T }, ...b: B) => C
    : T;
