import { LitElement, html, TemplateResult } from "lit"
import {customElement, property} from 'lit/decorators.js';

@customElement('title-bar')
export class Titlebar extends LitElement {
     @property() title = "Title";

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="drop-shadow-md p-2 bg-white">
            <h1>${this.title}</h1>
        </div>
        `
    }
}