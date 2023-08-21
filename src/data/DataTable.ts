import { Constraints, Query } from "./Query.js";
import { Create, Schema, Type } from "./Schema.js";
import { Results, Unwatch, Watcher } from "./DataSource.js";
import { Patch } from "./Patch.js";
import { filterRecords, getFilteredPatch, mergePatch } from "./functions.js";
import { getPrimaryKey } from "./functions.js";

class DataView<S extends Schema> {
    private watchers = new Set<Watcher<Results<Type<S>>>>;
    public mutableUpdates?: Patch<Results<Type<S>>>;

    constructor(
        public mutableRecords: Results<Type<S>> = {}
    ) {
    }

    public update(patch: Patch<Results<Type<S>>>) {
        this.mutableUpdates = mergePatch(this.mutableUpdates ?? {}, patch, true, true);
    }

    public applyPatchesAndNotify() {
        if (this.mutableUpdates) {
            this.mutableRecords = mergePatch(this.mutableRecords, this.mutableUpdates, false, true);
            for (let watcher of this.watchers) {
                watcher(this.mutableUpdates);
            }
            this.mutableUpdates = undefined;
        }
    }

    public addWatcher(watcher: Watcher<Results<Type<S>>>): Unwatch {
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
    private createdCount = 0;

    private constructor(
        public readonly schema: Schema,
        public readonly type: T,
    ) {
        super();
    }

    static create<S extends Schema, T extends string = S["id"]>(s: S, type?: T): DataTable<S, T> {
        return new DataTable(s, type ?? s.id) as unknown as DataTable<S, T>;
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

    async create(request: { type: T, value: Create<S> }): Promise<Type<S>> {
        let { type, value } = request;
        let primaryKey = getPrimaryKey(this.schema, value);
        if (!primaryKey) {
            primaryKey = `${++this.createdCount}`;
            value = { ...value, [this.schema.primaryKeys[0]]: primaryKey };
        }
        this.patch({ type, id: primaryKey, patch: value as Type<S> });
        return value as Type<S>;
    }

    peek(request: { type: T, id: string }): Type<S> | undefined {
        return this.mutableRecords[request.id] ?? undefined;
    }

    watch(request: { type?: T, id: string }, watcher: Watcher<Type<S> | null>): Unwatch;
    watch(request: { type?: T } & Query<S>, watcher: Watcher<Results<Type<S>>>): Unwatch;
    watch(request: { type?: T, id: string } & Query<S>, watcher: any) {
        if (request.id) {
            throw new Error("Not implemented get");
        }
        return this.getViewForQuery(request).addWatcher(watcher);
    }
    patch(request: { type: T, id: string, patch: Patch<Type<S>> }): void {
        this.update({ [request.id]: request.patch });
    }

    public applyPatchesAndNotify() {
        //  this root view will apply updates and notify watchers including filtered views.
        super.applyPatchesAndNotify();
        //  now all filtered views will aply updates and notify watchers.
        for (let view of this.filteredViews.values()) {
            view.applyPatchesAndNotify();
        }
    }

}
