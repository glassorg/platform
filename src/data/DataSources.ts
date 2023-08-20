import { personSchema } from "./sample/Person.js";
import { todoSchema } from "./sample/Todo.js";
import { DataSource, Request, Unwatch, Watcher } from "./DataSource.js";
import { DataTable } from "./DataTable.js";

class DataSources<DS extends DataSource | unknown = unknown> {

    private sources = new Map<string, DataSource>();

    add<D extends DataSource>(dataSource: D & { type: string }): DataSources<Omit<DS, "type"> & Omit<D, "type">> {
        this.sources.set(dataSource.type, dataSource);
        return this as any;
    }

    build(): DS {
        return this as any;
    }

    read(request: Request, watcher: Watcher<unknown>): Unwatch {
        return this.sources.get(request.type!)!.read(request, watcher);
    }
    write(request: Request): void {
        this.sources.get(request.type!)!.write!(request);
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
ds4.read({ type: "sample:Person" }, (persons) => { });
ds4.write({ type: "sample:Todo", id: "12", patch: { name: "foo", complete: null } });
ds4.peek({ type: "sample:Person", id: "12 " });