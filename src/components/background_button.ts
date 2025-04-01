import { LitElement, html, TemplateResult, css } from "lit"
import {customElement, property} from 'lit/decorators.js'

@customElement("background-button")
export class BackgroundButton extends LitElement {
    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <span class="p-1 cursor-pointer" @click="${() => this.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true}))}">
            <sl-icon name="files"></sl-icon>
        </span>
        `
    }
}