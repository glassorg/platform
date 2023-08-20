import { Schema, Type } from "../Schema.js";

export const todoSchema = {
    id: "sample:Todo",
    type: "object",
    primaryKeys: ["name"],
    indexes: ["alpha", "complete"],
    properties: {
        name: {
            type: "string",
        },
        alpha: {
            type: "string",
        },
        complete: {
            type: "integer",
            minimum: 0,
            maximum: 100
        },
    }
} as const satisfies Schema;

export type Todo = Type<typeof todoSchema>;
