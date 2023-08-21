import type { DeepReadonly, Primitive, Simplify, StringKeyof } from "../common/types.js";
import type { JSONSchema7, JSONSchema7Object } from "json-schema";
import { Types } from "./Types.js";

type SchemaExtensions = { type?: keyof Types, keys?: ExtendedSchemaObject };
type ExtendedSchema = Omit<JSONSchema7, "type"> & SchemaExtensions;
type ExtendedSchemaObject = Omit<JSONSchema7Object, "type"> & SchemaExtensions;

/**
 * Represents a data document schema. Must be an object type.
 */
export type Schema = DeepReadonly<{
    id: string;
    type: "object";

    primaryKeys: string[];
    indexes?: string[];
    required?: string[];

    properties: {
        [key: string]: ExtendedSchema;
    };
}>

type BaseType<S extends DeepReadonly<ExtendedSchemaObject>> =
    S extends Primitive ? S :
    S extends DeepReadonly<{ enum: unknown[] }> ? S["enum"][number] :
    S extends DeepReadonly<{ type: "array", items: ExtendedSchema }> ? BaseType<S["items"]>[] :
    S extends DeepReadonly<{ type: "Set", items: ExtendedSchema }> ? Set<BaseType<S["items"]>> :
    S extends DeepReadonly<{ type: "Map", keys: ExtendedSchema, items: ExtendedSchema }> ? Map<BaseType<S["keys"]>, BaseType<S["items"]>> :
    S extends DeepReadonly<{ properties: object }> ? {
        [K in StringKeyof<S["properties"]>]: S["properties"][K] extends DeepReadonly<ExtendedSchema> ? BaseType<S["properties"][K]> : "?"
    } :
    S extends DeepReadonly<ExtendedSchemaObject> ? (
        S["type"] extends keyof Types ? Types[S["type"]] :
        {}
    ) : unknown;

export type FieldsInProperty<D extends Schema, P extends "indexes" | "primaryKeys" | "required">
    = D[P] extends Readonly<string[]> ? { [K in D[P][number]]: K }[D[P][number]] : never;
export type FieldsNotInProperty<D extends Schema, P extends "indexes" | "primaryKeys" | "required">
    = D[P] extends Readonly<string[]>
    ? { [K in keyof D["properties"]]: K extends D[P][number] ? never : K }[keyof D["properties"]]
    : keyof D["properties"];

export type RequiredProperties<D extends Schema> = Pick<BaseType<D>, FieldsInProperty<D, "required">>;
export type OptionalProperties<D extends Schema> = Partial<Pick<BaseType<D>, FieldsNotInProperty<D, "required">>>;
export type PrimaryKeyProperties<D extends Schema> = Pick<BaseType<D>, FieldsInProperty<D, "primaryKeys">>;
export type IndexedProperties<D extends Schema> = Pick<BaseType<D>, FieldsInProperty<D, "indexes"> | FieldsInProperty<D, "primaryKeys">>;

export type Type<D extends Schema> = object & Simplify<PrimaryKeyProperties<D> & RequiredProperties<D> & OptionalProperties<D>>;
export type Create<D extends Schema> = object & Simplify<Partial<PrimaryKeyProperties<D>> & RequiredProperties<D> & OptionalProperties<D>>;
