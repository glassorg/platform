import { personSchema } from "../data/sample/Person.js";
import { todoSchema } from "../data/sample/Todo.js";
import { DataSource } from "./DataSource.js";
import { DataTable } from "./DataTable.js";

class DataSources<DS extends DataSource | unknown = unknown> {

    add<D extends DataSource>(dataSource: D): DataSources<DS & D> {
        return this as any;
    }

    build(): DS {
        return this as any;
    }

}

const taskTable = DataTable.create(todoSchema);
const personTable = DataTable.create(personSchema);

declare const foo: typeof taskTable & typeof personTable;

const ds1 = new DataSources();
const ds2 = ds1.add(taskTable);
const ds3 = ds2.add(personTable);
const ds4 = ds3.build();
ds4.read({ type: "sample:Person", id: "12" }, (person) => { });
ds4.read({ type: "sample:Person" }, (persons) => { })
ds4.write({ type: "sample:Todo", id: "12", patch: { name: "foo", complete: null } })
