import { Constraints, Query } from "./Query.js";
import { Schema, Type } from "./Schema.js";
import { DataSource, Records, Unwatch, Watcher } from "./DataSource.js";
import { Patch } from "./Patch.js";
import { filterRecords, getFilteredPatch, mergePatch } from "./functions.js";

interface IDataTable<S extends Schema, T extends string = S["id"]> extends DataSource<T> {
    type: T;
    peek(request: { type: T, id: string }): Type<S> | null;
    read(request: { type: T, id: string }, watcher: Watcher<Type<S>>): Unwatch;
    read(request: { type: T } & Query<S>, watcher: Watcher<Type<S>[]>): Unwatch;
    write(request: { type: T, id: string, patch: Patch<Type<S>> | null }): void;
}

class DataView<S extends Schema> {
    private watchers = new Set<Watcher<Records<Type<S>>>>;
    public mutableUpdates?: Patch<Records<Type<S>>>;

    constructor(
        public mutableRecords: Records<Type<S>> = {}
    ) {
    }

    public update(patch: Patch<Records<Type<S>>>) {
        this.mutableUpdates = mergePatch(this.mutableUpdates ?? {}, patch, true, true);
    }

    public applyUpdatesAndNotify() {
        if (this.mutableUpdates) {
            this.mutableRecords = mergePatch(this.mutableRecords, this.mutableUpdates, false, true);
            for (let watcher of this.watchers) {
                watcher(this.mutableUpdates);
            }
            this.mutableUpdates = undefined;
        }
    }

    public addWatcher(watcher: Watcher<Records<Type<S>>>): Unwatch {
        watcher({ ...this.mutableRecords });
        this.watchers.add(watcher);
        return () => {
            this.watchers.delete(watcher);
        }
    }

}

export class DataTable<S extends Schema, T extends string = S["id"]> extends DataView<S> {

    /** Filtered sub views keyed by JSON.stringify(query.where) */
    private filteredViews = new Map<string, DataView<S>>();

    private constructor(
        public readonly schema: Schema,
        public readonly type: T,
    ) {
        super();
    }

    static create<S extends Schema, T extends string = S["id"]>(s: S, type?: T): IDataTable<S, T> {
        return new DataTable(s, type ?? s.id) as unknown as IDataTable<S, T>;
    }

    private getFilteredView(where: Constraints<unknown>): DataView<S> {
        const key = JSON.stringify(where);
        let view = this.filteredViews.get(key);
        if (!view) {
            const filteredRecords = filterRecords(this.mutableRecords, where);
            this.filteredViews.set(key, view = new DataView<S>(filteredRecords));
            // add a watcher here... note it will never be unwatched.
            this.addWatcher((patch) => {
                const filterdPatch = getFilteredPatch(view!.mutableRecords, patch, where);
                view!.update(filterdPatch);
            })
        }
        return view;
    }

    getViewForQuery(query: Query<S>): DataView<S> {
        if (query.sort || query.select) {
            throw new Error("Not implemented yet");
        }
        else if (query.where) {
            return this.getFilteredView(query.where);
        }
        else {
            return this;
        }
    }

    read(request: { type: T, get: string }, watcher: Watcher<Type<S>>): Unwatch;
    read(request: { type: T, query: Query<S> }, watcher: Watcher<Records<Type<S>>>): Unwatch;
    read(request: any, watcher: any) {
        const query = request.query as Query<S> | undefined;
        if (query) {
            return this.getViewForQuery(query).addWatcher(watcher);
        }
        throw new Error("Not implemented");
    }
    write(request: { type: T, patch: Patch<T> }): void {
        this.update(request.patch);
    }

}