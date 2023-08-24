import { WebComponent } from "./WebComponent.js";

export function useState<T>(initialValue: T) {
    const component = WebComponent.current;
    const hookIndex = component.hookIndex++;
    const value = component.hooks[hookIndex] ??= initialValue;
    return [
        value,
        (newValue: T) => {
            component.hooks[hookIndex] = newValue;
            component.invalidate();
        }
    ];
}

type EffectCallback = () => (void | (() => void));
type EffectHookState = { dispose?: () => void, dependencies: any[] };

function arraysEqualShallow(a: any[], b: any[]) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

export function useEffect(callback: EffectCallback, dependencies: any[] = []) {
    const component = WebComponent.current;
    const hookIndex = component.hookIndex++;
    const oldHookState = component.hooks[hookIndex] as EffectHookState | undefined;
    let rerunEffect = !oldHookState || !arraysEqualShallow(dependencies, oldHookState.dependencies);
    if (rerunEffect) {
        oldHookState?.dispose?.();
        component.hooks[hookIndex] = { dispose: callback() ?? undefined, dependencies };
    }
}
