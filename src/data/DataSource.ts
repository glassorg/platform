import { Patch } from "./Patch.js";

export type Watcher<T = unknown> = (patch: Patch<T>) => void;
export type Unwatch = () => void;
export type Request<T extends string = string> = { type: T };
export type Records<T = unknown> = Record<string, T>;

export interface DataSource<T extends string = string> {
    type?: T;
    read(request: Request<T>, watcher: Watcher<Records>): Unwatch;
    write?(request: Request<T>): void;
}
