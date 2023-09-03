import { LitElement, html } from 'lit';
import { MyClassElement, myClassElement } from './MyClassElement.js'; import { NodeBlueprint } from '../src/ui/NodeBlueprint.js';
import { HTMLElementName } from '../src/ui/html/HTMLNodeFactory.js';
import { customElement } from '../src/ui/html/customElement.js';
import { p, span } from '../src/ui/html/elements.js';
MyClassElement;

type Props = { name: string, style?: Partial<CSSStyleDeclaration>, children: (NodeBlueprint<HTMLElementName> | string)[] };
export const helloElement = customElement(
    () => {
        return span(
            p("P Application Root Here"),
            myClassElement(),
        )
    },
    {
        tagName: "application-root"
    }
);
