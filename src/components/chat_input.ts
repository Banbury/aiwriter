import { SlButton, SlTextarea } from "@shoelace-style/shoelace"
import { LitElement, html, TemplateResult, PropertyValues, css } from "lit"
import { customElement, state, property, query } from 'lit/decorators.js'

@customElement('chat-input')
export class ChatInput extends LitElement {
    @property() value: string = ""

    @query('#send')
    private sendButton: SlButton

    @query('#abort')
    private abortButton: SlButton

    @query("#input")
    private input: SlTextarea

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">

        <div class="bg-white flex flex-row gap-2 p-2" style="box-shadow: 0px -4px 6px 0px rgba(0, 0, 0, 0.1);">
            <textarea id="input" rows="3" class="border rounded border-light-border text-sm p-2 h-full grow" value=${this.value}></textarea>
            <sl-button id="send" variant="primary" @click=${this.on_send}>
                Send <sl-icon name="send"></sl-icon>
            </sl-button>
            <sl-button id="abort" variant="default" size="medium" circle disabled @click=${this.on_abort}>
                <sl-icon name="stop-fill" label="Abort"></sl-icon>
            </sl-button>
        </div>
        `
    }

    enable(val: boolean = true) {
        this.sendButton.disabled = !val
        this.abortButton.disabled = val
        this.input.disabled = !val
    }

    private on_send() {
        this.enable(false)
        this.input.value = ""
        this.dispatchEvent(new CustomEvent('send', { detail: { prompt: this.input?.value }, bubbles: true, composed: true }))
    }

    private on_abort() {
        this.enable(true)
        this.dispatchEvent(new CustomEvent('abort', { bubbles: true, composed: true }))
    }
}