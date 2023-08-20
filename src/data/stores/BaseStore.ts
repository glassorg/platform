// import { Schema, Type } from "../Schema.js";
// import { Create, Store, Delete, Patch, Query, Result, SelectQuery, Unwatch } from "../Store.js";

// export abstract class BaseStore<S extends Schema, T = Type<S>> implements Store<S, T> {

//     constructor(
//         protected readonly schema: S
//     ) {
//     }

//     abstract watch<P extends ReadonlyArray<keyof T>>(query: SelectQuery<S, T, P>, callback: (results: Result<T, P>[]) => void): Unwatch;
//     abstract watch(query: Query<S>, callback: (results: T[]) => void): Unwatch;
//     abstract create(document: Create<S>): void;
//     abstract patch(changes: Patch<S>): void;
//     abstract delete(document: Delete<S>): void;

//     protected getPrimaryKey(record: any) {
//         const { primaryKeys } = this.schema;
//         return primaryKeys.length === 1 ? (record as any)[primaryKeys[0] as any] : primaryKeys.map(name => (record as any)[name]).join(",");
//     }

// }