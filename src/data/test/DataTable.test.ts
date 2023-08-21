import { describe, expect, test } from 'vitest'
import { DataTable } from '../DataTable.js';
import { Person, personSchema } from './Person.js';
import { DataSourceWithTypeFunctions, Results } from '../DataSource.js';
import { mergePatch } from '../functions.js';

describe(`DataTable`, () => {
    test(`should create records`, async () => {
        const personTable = DataTable.create(personSchema);
        const id = "1";
        expect(personTable.peek({ type: "sample:Person", id })).to.be.undefined;
        const createValue = {
            name: id, age: 10, gender: "other"
        } as const;
        const created = await personTable.create({
            type: "sample:Person", value: createValue
        });
        expect(created).to.equal(createValue);

        // trigger updates
        personTable.applyPatchesAndNotify();
        expect(personTable.peek({ type: "sample:Person", id })).to.equal(created);
    });
    test(`should be able to watch queries`, async () => {
        const personTable = DataTable.create(personSchema);
        let callbackResults: Results<Person> | undefined = undefined;
        let callbackCount = 0;
        let unwatch = personTable.watch({ type: "sample:Person" }, (results) => {
            callbackResults = mergePatch(callbackResults, results);
            callbackCount++;
        })

        expect(callbackResults).to.deep.equal({});
        expect(callbackCount).to.equal(1);
    });
});
