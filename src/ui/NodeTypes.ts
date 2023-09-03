import { INode } from "./INode.js";

export type NodeName = keyof NodeNameToType;

export interface NodeNameToType {
}

export interface NodeNameToProperties {
}

export interface NodeNameToChildName {
}

export type NodeType<T extends NodeName> = T extends keyof NodeNameToType ? INode & NodeNameToType[T] : never;
export type NodeProperties<T extends NodeName> = T extends keyof NodeNameToProperties ? NodeNameToProperties[T] : never;
export type NodeChildName<T extends NodeName> = T extends keyof NodeNameToChildName ? NodeNameToChildName[T] : never;
