import { customElement } from '../src/ui/html/customElement.js';
import { element, h1, li, p, ul } from '../src/ui/html/elements.js';
import { sample01Controls } from './Sample01Controls.js';

export const applicationRoot = customElement(
    function () {
        return element(
            h1(`Application Root`),
            ul(
                li({ style: { color: "red" } }, "Foo"),
                li({ style: { color: "blue" } }, "Bar"),
            ),
            sample01Controls(),
        )
    },
    {
        tagName: "application-root"
    }
);
