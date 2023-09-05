import { WebComponent, getCurrentWebComponent } from "../html/WebComponent.js";
import { arraysEqualShallow } from "../../common/arraysEqualShallow.js";

export type EffectCallback = () => (void | (() => void));
type EffectHookState = { dispose?: () => void, dependencies: any[] };

export function useEffect<T extends WebComponent>(callback: EffectCallback, dependencies: any[] = []) {
    const component = getCurrentWebComponent() as T;
    const hookIndex = component.hookIndex++;
    const oldHookState = component.hooks[hookIndex] as EffectHookState | undefined;
    let rerunEffect = !oldHookState || !arraysEqualShallow(dependencies, oldHookState.dependencies);
    if (rerunEffect) {
        oldHookState?.dispose?.();
        component.hooks[hookIndex] = { dispose: callback.call(component) ?? undefined, dependencies };
    }
}
