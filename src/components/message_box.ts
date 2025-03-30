import { SlDialog } from "@shoelace-style/shoelace"
import { LitElement, html, TemplateResult, css } from "lit"
import { customElement, state, property, query } from 'lit/decorators.js'

@customElement("message-box")
export class MessageBox extends LitElement {
    @property()
    message: string

    @property()
    title: string

    @property()
    type: MessageBox.Type = MessageBox.Buttons.Ok

    @query("#dialog")
    private dialog: SlDialog

    private callback: () => void

    private readonly okButton = html`<sl-button variant="primary" @click=${this.on_okay}>Ok</sl-button>`
    private readonly okCancelButton = html`<sl-button variant="primary" @click=${this.on_okay}>Ok</sl-button><sl-button autofocus @click=${this.on_cancel}>Cancel</sl-button>`
    private readonly yesNoButton = html`<sl-button variant="primary" @click=${this.on_okay}>Yes</sl-button><sl-button autofocus @click=${this.on_cancel}>No</sl-button>`

    static styles = css`
    #buttons {
        width: fit-content;
        float: right;
    }
    `

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <sl-dialog id="dialog" label=${this.title}>
            ${this.message}
            <div slot="footer" id="buttons" class="flex flex-row gap-2 w-fit">${this.getButtons()}</div>
        </sl-dialog>
        `
    }

    public show(callback: () => void) {
        this.callback = callback
        this.dialog.show()
    }

    private getButtons(): TemplateResult {
        switch (Number(this.type)) {
            case MessageBox.Buttons.Ok:
                return this.okButton
            case MessageBox.Buttons.OkCancel:
                return this.okCancelButton
            case MessageBox.Buttons.YesNo:
                return this.yesNoButton
            default:
                return this.okButton
        }
    }

    private on_okay() {
        this.dialog.hide()
        this.callback()
    }

    private on_cancel() {
        this.dialog.hide()
    }
}

export namespace MessageBox {
    export const Buttons = {
        Ok: 0,
        OkCancel: 1,
        YesNo: 2
    } as const
    export type Type = typeof Buttons[keyof typeof Buttons];
}
