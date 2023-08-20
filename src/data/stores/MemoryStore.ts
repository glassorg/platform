// import { BaseStore } from "./BaseStore.js";
// import { Schema, Type } from "../Schema.js";
// import { Query, Patch, Create, Delete } from "../Store.js";
// import { mergePatch, normalizeKeyOrder } from "../functions.js";
// import { createSortFunction, doesDocumentSatisfyConstraints } from "../Query.js";

// type Watcher = (results: any[]) => void;

// class MemoryView<S extends Schema, T extends Type<S> = Type<S>> {

//     private watchers = new Set<Watcher>();
//     private records = new Map<any, T>();
//     private updates = new Map<any, T | null>();
//     private results: T[] = [];

//     constructor(
//         private readonly query: Query<S>
//     ) {
//     }

//     applyUpdatesAndNotify() {
//         if (this.updates.size == 0) {
//             return;
//         }
//         for (let [key, record] of this.updates.entries()) {
//             if (record) {
//                 this.records.set(key, record);
//             }
//             else {
//                 this.records.delete(key);
//             }
//         }
//         this.updates.clear();

//         // TODO: Later, avoid O(n) performance on single record updates.
//         const results = [...this.records.values()];
//         if (this.query.sort) {
//             results.sort(createSortFunction(this.query.sort));
//         }
//         this.results = results;
//         for (let watcher of this.watchers) {
//             watcher(this.results);
//         }
//     }

//     recordUpdated(primaryKey: any, record: T | null) {
//         if (record && doesDocumentSatisfyConstraints<S>(record, this.query.where as any)) {
//             this.updates.set(primaryKey, record);
//         }
//         else if (this.records.has(primaryKey)) {
//             this.updates.set(primaryKey, null);
//         }
//     }

//     addWatcher(watcher: Watcher) {
//         this.watchers.add(watcher);
//         watcher(this.results);
//     }

//     removeWatcher(watcher: Watcher) {
//         this.watchers.delete(watcher);
//     }
// }

// export class MemoryStore<S extends Schema> extends BaseStore<S> {

//     documents = new Map<any, Type<S>>();
//     views = new Map<string, MemoryView<S>>();

//     private getView(query: Query<S>) {
//         let key = JSON.stringify(normalizeKeyOrder(query));    //  probably should normalize.
//         let view = this.views.get(key);
//         if (!view) {
//             this.views.set(key, view = new MemoryView<S>(query));
//         }
//         return view;
//     }

//     public applyUpdatesAndNotify() {
//         for (const view of this.views.values()) {
//             view.applyUpdatesAndNotify();
//         }
//     }

//     override watch<Q extends Query<S>>(query: Q, watcher: Watcher) {
//         let view = this.getView(query);
//         view.addWatcher(watcher);
//         return () => {
//             view.removeWatcher(watcher);
//         };
//     }
//     override create(document: Create<S>) {
//         this.documents.set(this.getPrimaryKey(document), document);
//     }
//     override patch(changes: Patch<S>) {
//         const pk = this.getPrimaryKey(changes);
//         const oldDocument = this.documents.get(pk) as any;
//         const newDocument = mergePatch(oldDocument, changes);
//         if (newDocument !== oldDocument) {
//             // notify changes.
//             this.documents.set(pk, newDocument);
//         }
//     }
//     override delete(document: Delete<S>) {
//         this.documents.delete(this.getPrimaryKey(document));
//     }
// }