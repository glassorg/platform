
export interface Types {
    //  json-schema data types
    integer: number;
    number: number;
    string: string;
    boolean: boolean;
    object: object;
    null: null;
    array: Array<unknown>;
    //  extension data types
    Map: Map<unknown, unknown>;
    Set: Set<unknown>;
    Int8Array: Int8Array;
    Uint8Array: Uint8Array;
    Int16Array: Int16Array;
    Uint16Array: Uint16Array;
    Int32Array: Int32Array;
    Uint32Array: Uint32Array;
    Float32Array: Float32Array;
    Float64Array: Float64Array;
    Blob: Blob;
    File: File;
}
