import Animator, { AnimatorProps } from "./Animator.js";
import Control, { ControlProps } from "./Control.js";
import Geometry, { GeometryProps } from "./Geometry.js";
import SceneNode, { SceneNodeProps } from "./SceneNode.js";
import Screen, { ScreenProps } from "./Screen.js";
import View, { ViewProps } from "./View.js";

export const sceneNodeNameToType = {
    Animator: Animator<any>,
    Control: Control,
    Geometry: Geometry,
    Screen: Screen,
    View: View,
    SceneNode: SceneNode,
} as const;

export const sceneNodeNames = Object.keys(sceneNodeNameToType) as Array<keyof typeof sceneNodeNameToType>;
export type SceneNodeNames = typeof sceneNodeNames;
export type SceneNodeName = SceneNodeNames[number];

type SceneNodeNameToType = { [Key in SceneNodeName]: InstanceType<typeof sceneNodeNameToType[Key]> };

declare module "../../NodeTypes.js" {

    type SceneNodeNameToChildName = { [Key in keyof SceneNodeNameToType]: keyof SceneNodeNameToType };

    export interface NodeNameToType extends SceneNodeNameToType {
    }

    export interface NodeNameToChildName extends SceneNodeNameToChildName {
    }

    export interface NodeNameToProperties {
        Animator: AnimatorProps<any>,
        Control: ControlProps,
        Geometry: GeometryProps,
        Screen: ScreenProps,
        View: ViewProps,
        SceneNode: SceneNodeProps,
    }

}