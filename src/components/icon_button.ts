import { LitElement, html, TemplateResult, css } from "lit"
import {customElement, property} from 'lit/decorators.js'

@customElement("icon-button")
export class IconButton extends LitElement {
    @property() icon: string

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <span class="p-1 cursor-pointer" @click="${() => this.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true}))}">
            <sl-icon name=${this.icon} exportparts="icon"></sl-icon>
        </span>
        `
    }
}