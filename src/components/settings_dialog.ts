import { LitElement, html, TemplateResult, css, PropertyValues } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'

@customElement("settings-dialog")
export class SettingsDialog extends LitElement {
    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <span class="p-1 cursor-pointer" @click="${() => this.dispatchEvent(new CustomEvent('click', { bubbles: true, composed: true}))}">
            <sl-icon name="gear"></sl-icon>
        </span>

        `
    }
}