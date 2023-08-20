import { Query } from "../data/Query.js";
import { Schema, Type } from "../data/Schema.js";
import { DataSource, Unwatch, Watcher } from "./DataSource.js";
import { Patch } from "./Patch.js";

interface IDataTable<S extends Schema, T extends string = S["id"]> extends DataSource<T> {
    read(request: { type: T, id: string }, watcher: Watcher<Type<S>>): Unwatch;
    read(request: { type: T } & Query<S>, watcher: Watcher<Type<S>[]>): Unwatch;
    write(request: { type: T, id: string, patch: Patch<Type<S>> | null }): void;
}

export class DataTable<S extends Schema, T extends string = S["id"]> {

    private constructor(
        public readonly schema: Schema,
        public readonly type: T,
    ) {
    }

    static create<S extends Schema, T extends string = S["id"]>(s: S, type?: T): IDataTable<S, T> {
        return new DataTable(s, type ?? s.id) as unknown as IDataTable<S, T>;
    }

    read(request: { type: T, get: string }, watcher: Watcher<Type<S>>): Unwatch;
    read(request: { type: T, query: Query<S> }, watcher: Watcher<Type<S>[]>): Unwatch;
    read(request: any) {
        return null as any;
    }
    write(request: { type: T, patch: Patch<T> }): void {
    }

}