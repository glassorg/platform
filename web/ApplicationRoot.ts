import { myClassElement } from './MyClassElement.js';
import { customElement } from '../src/ui/html/customElement.js';
import { element, p } from '../src/ui/html/elements.js';

export const applicationRoot = customElement(
    () => {
        return element(
            p("P Application Root Here"),
            myClassElement(),
        )
    },
    {
        tagName: "application-root"
    }
);
