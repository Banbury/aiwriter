import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup, PropertyDeclaration } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'

import { SlButton } from "@shoelace-style/shoelace"

import { BackgroundTags } from "../models/background"

@customElement("tag-list")
export class TagList extends LitElement {
    @property() tags: string[]

    @query("#input")
    private input: HTMLInputElement

    @query("sl-button")
    private button: SlButton

    static styles = css`
    input {
        border-radius: 17px;
        padding: 4px 10px;
    }
    `

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <span>
            ${this.tags?.map(tag => html`
            <sl-tag removable pill @sl-remove=${() => this.on_remove(tag)}>${tag}</sl-tag>
            `)}
            <sl-button variant="default" size="small" circle @click=${this.on_add}>
              <sl-icon name="plus"></sl-icon>
            </sl-button>
            <input id="input" hidden class="border border-light-border text-sm" @keydown=${this.on_keydown} />
            </span>
        `
    }

    private on_remove(tag: string) {
        this.tags = this.tags.filter(it => it !== tag)
    }

    private on_add(tag: string) {
        this.input.hidden = false
        this.input.focus()
        this.button.hidden = true
    }

    private on_keydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            if (this.input.value) {
                this.addTag(this.input.value)
            }
            this.input.hidden = true
            this.button.hidden = false
        }
    }

    private addTag(tag: string) {
        this.tags = [...this.tags, tag]
    }
}