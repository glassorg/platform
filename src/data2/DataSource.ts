import { Patch } from "./Patch.js";

export type Watcher<T> = (patch: Patch<T>) => void;
export type Unwatch = () => void;
export type Request<T extends string> = { type: T };

export interface DataSource<T extends string = string> {
    read(request: Request<T>, watcher: Watcher<unknown>): Unwatch;
    write(request: Request<T>): void;
}
