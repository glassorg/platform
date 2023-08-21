import { describe, expect, test } from 'vitest'
import { DataTable } from '../DataTable.js';
import { Person, personSchema } from './Person.js';
import { Results } from '../DataSource.js';
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
    test(`should create records with new primary keys`, async () => {
        const personTable = DataTable.create(personSchema);
        const createValue = {
            age: 10, gender: "other"
        } as const;
        const created = await personTable.create({
            type: "sample:Person", value: createValue
        });
        expect(created).to.not.equal(createValue);
        expect(created.name).to.equal("1");

        //  trigger updates
        personTable.applyPatchesAndNotify();
        //  check that created object exists now
        expect(personTable.peek({ type: "sample:Person", id: created.name })).to.equal(created);
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

        // create item
        const create1 = {
            name: "Kris", age: 10, gender: "other"
        } as const;
        personTable.create({ type: "sample:Person", value: create1 });

        //  should not be a callback yet.
        expect(callbackCount).to.equal(1);

        personTable.applyPatchesAndNotify();

        expect(callbackResults).to.deep.equal({ [create1.name]: create1 });
        expect(callbackCount).to.equal(2);

        //  stop watching
        unwatch();

        personTable.create({ type: "sample:Person", value: { name: "Foo", age: 12, gender: "female" } });
        personTable.applyPatchesAndNotify();

        expect(callbackResults).to.deep.equal({ [create1.name]: create1 });
        expect(callbackCount).to.equal(2);

    });
});
