import { LitElement, html, TemplateResult } from "lit"
import {customElement, property} from 'lit/decorators.js';

@customElement('title-bar')
export class Titlebar extends LitElement {
     @property() title = "Title";

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="drop-shadow-md p-2 bg-white">
            <div class="flex flex-row">
                <h1 class="grow">${this.title}</h1>
                <div class=""><slot name="toolbar"></slot></div>
            </div>
        </div>
        `
    }
}