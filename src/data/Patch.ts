import { OptionalKeys, Primitive, RequiredKeys } from "../common/types.js";

type PatchObject<T extends object> =
    {
        readonly [P in OptionalKeys<T>]?: Patch<T[P]> | null
    } & {
        readonly [P in RequiredKeys<T>]?: Patch<T[P]>
    };

export type Patch<T> =
    (
        T extends Primitive | Blob ? T :
        T extends {} /*  | ReadonlyArray<unknown> | ReadonlySet<unknown> | ReadonlyMap<unknown, unknown> */ ? PatchObject<T> :
        T
    );

