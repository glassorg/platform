import { Person, personSchema } from "./test/Person.js";
import { todoSchema } from "./test/Todo.js";
import { DataSource, Request, Results, Unwatch, Watcher } from "./DataSource.js";
import { DataTable } from "./DataTable.js";
import { Patch } from "./Patch.js";

class DataSources<DS extends DataSource | unknown = unknown> {

    private sources = new Map<string, DataSource>();

    add<D extends DataSource, T extends string>(dataSource: D & { type: T }): DataSources<MergeDataSources<DS, D>> {
        this.sources.set(dataSource.type, dataSource);
        return this as any;
    }

    build(): DS {
        return this as any;
    }

    peek(request: Request): any {
        return this.sources.get(request.type!)!.peek(request);
    }

    watch(request: Request, watcher: Watcher<unknown>): Unwatch {
        return this.sources.get(request.type!)!.watch(request, watcher);
    }
    patch(request: Request): void {
        this.sources.get(request.type!)!.patch!(request);
    }

}

type MergeDataSources<A extends DataSource | unknown, B extends DataSource> =
    A extends DataSource ?
    Omit<A, "type">
    &
    Omit<B, "type">
    : B;

const taskTable = DataTable.create(todoSchema);
const personTable = DataTable.create(personSchema);

const ds1 = new DataSources();
const ds2 = ds1.add(taskTable);
const ds3 = ds2.add(personTable);
const ds4 = ds3.build();
ds4.watch({ type: "sample:Person", id: "12" }, (person: Patch<Person> | null) => { });
ds4.watch({ type: "sample:Person" }, (persons: Patch<Results<Person>>) => { });
ds4.patch({ type: "sample:Todo", id: "12", patch: { name: "foo", complete: null } });
ds4.peek({ type: "sample:Person", id: "12" });