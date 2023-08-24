import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MyElement } from './MyElement.js'; MyElement;
import { MyCustomBase } from './MyCustomBase.js'; MyCustomBase;

@customElement('application-root')
export class ApplicationRoot extends LitElement {
    render() {
        const result = html`
    <p>Application Root Here!</p>
    <my-custom-base>My Custom Base Content</my-custom-base>
    <my-element alpha="foo"></my-element>
    `;
        return result;
    }
}
