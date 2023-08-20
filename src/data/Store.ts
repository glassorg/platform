// import { Type, PrimaryKeyProperties, Schema } from "./Schema.js";
// import { Query, SelectQuery } from "./Query.js";
// import { personSchema } from "./sample/Person.js";
// import { todoSchema } from "./sample/Todo.js";
// import { Extends, Simplify } from "../common/types.js";
// export { Query, SelectQuery } from "./Query.js";

// export type Result<T, P extends ReadonlyArray<keyof T> = ReadonlyArray<keyof T>> = Simplify<Pick<T, P[number]>>;

// export type Unwatch = () => void;

// export type Create<S extends Schema> = Type<S>;
// export type Delete<S extends Schema> = PrimaryKeyProperties<S>;
// export type Patch<D extends Schema> = PrimaryKeyProperties<D> & Partial<Type<D>>;

// export interface Store<S extends Schema, T = Type<S>> {

//     watch<P extends ReadonlyArray<keyof T>>(query: SelectQuery<S, T, P>, callback: (results: Result<T, P>[]) => void): Unwatch;
//     watch(query: Query<S>, callback: (results: T[]) => void): Unwatch;
//     create(document: Create<S>): void;
//     patch(changes: Patch<S>): void;
//     delete(document: Delete<S>): void;

// }

// let persons!: Store<typeof personSchema>;
// persons.watch({ type: "sample:Person", select: ["name", "age", "map"], where: { "name": "foo", "age": { "<=": 12 }, luckyNumbers: { "contains": 69 } }, sort: { age: true }, offset: 10, count: 100 } as const, (results) => {
//     type Check = Extends<typeof results, {
//         map?: Map<number, boolean>;
//         name: string;
//         age: number;
//     }[]> & Extends<{
//         map?: Map<number, boolean>;
//         name: string;
//         age: number;
//     }[], typeof results>;
// });

// let todos!: Store<typeof todoSchema>;
// todos.watch({ type: "sample:Todo" }, (results) => {
//     type Check = Extends<typeof results, {
//         name: string;
//         alpha?: string | undefined;
//         complete?: number | undefined;
//     }[]> & Extends<{
//         name: string;
//         alpha?: string | undefined;
//         complete?: number | undefined;
//     }[], typeof results>;
// });

