import { describe, expect, test, beforeAll } from 'vitest'
import { indexedDB } from "fake-indexeddb";
// import { IndexedDBStore } from './IndexedDBStore.js';

describe(`IndexedDBStore`, () => {
    beforeAll(() => {
        // shim the indexed db store so we can test our indexed db store.
        globalThis.indexedDB = indexedDB;
    })
    test(`global indexedDB shim should exist`, async () => {
        expect(globalThis.indexedDB).to.exist;
    })
    // test(`Should be able to create an instance`, async () => {
    //     const store = await IndexedDBStore.create("test");
    //     expect(store).to.exist;
    //     console.log({ store });
    // })
})
