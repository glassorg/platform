// import { TypeId, Schemas, getSchema, schemas } from "../Schema.js";
// import { Patch, PrimaryKeyProperties, Type } from "../Type.js";
// import { DataStore, Query, Result, Unwatch } from "../DataStore.js";

// export class IndexedDBStore implements DataStore {

//     private stores: Map<string, IDBObjectStore>;

//     private constructor(private readonly db: IDBDatabase) {
//         this.stores = new Map([...schemas.entries()].map(([name, schema]) => {
//             const store = db.createObjectStore(name);
//             return [name, store];
//         }));
//     }

//     watch<T extends TypeId>(query: Query<T>, callback: (results: Result<Query<T>, T>[]) => void): Unwatch {
//         return () => {
//         };
//     }
//     patch<T extends TypeId>(id: T, document: Patch<Schemas[T]>): void {
//     }
//     create<T extends TypeId>(id: T, document: Type<Schemas[T]>): void {
//     }
//     delete<T extends TypeId>(id: T, document: PrimaryKeyProperties<Schemas[T]>): void {
//     }

//     static async create(name: string): Promise<IndexedDBStore> {
//         const db = await new Promise<IDBDatabase>((resolve, reject) => {
//             const result = indexedDB.open(name, 1);
//             result.onsuccess = e => resolve((e.target as any).result as IDBDatabase);
//             result.onerror = e => reject("Permission denied");
//         });

//         console.log(`Database`, { db });
//         return new IndexedDBStore(db);
//     }

// }
