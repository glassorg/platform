import { getCurrentWebComponent } from "../html/WebComponent.js";

export function useState<T>(initialValue: T) {
    const component = getCurrentWebComponent();
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
