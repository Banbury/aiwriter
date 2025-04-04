import { LitElement, html, TemplateResult, css, PropertyValues } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'
import { Task } from '@lit/task'
import { StoryService } from "../services/story-service"
import { SlDialog} from "@shoelace-style/shoelace"

import { BackgroundForm } from "./background_form"
import { Background } from "../models/background"

import "./background_form"

@customElement("background-dialog")
export class BackgroundDialog extends LitElement {
    @property() story: number
    @property({ attribute: "background"}) background_id: number

    private readonly storyService = new StoryService()

    @query("#dialog")
    private dialog: SlDialog

    @query("#form")
    private form: BackgroundForm

    private background = new Task(this, {
        task: async ([id], {signal}): Promise<Background> => {
            if (id > 0) {
              return this.storyService.getBackground(id)
            }
            return new Promise<Background>(resolve => resolve(new Background()))
        },
        autoRun: false,
        args: () => [this.background_id]
    })

    static styles = css`
        sl-button[variant="text"] {
            width: 25px;
        }

        sl-button[variant="text"]::part(base) {
            color: black;
        }

        sl-dialog::part(base) {
            color: black;
        }
    `
    
    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div>
            <sl-dialog id="dialog" label="Background" @sl-show=${this.on_open}>
                <div>
                    ${this.background.render({
                        pending: () => html`<p>Loading...</p>`,
                        complete: (value) => html`
                        <background-form id="form" .background=${value}></background-form>
                        `,
                        error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
                    })}
                </div>
                <sl-button variant="primary" slot="footer" @click="${this.on_save}">Save</sl-button>
            </sl-dialog>
        </div>
        `
    }

    show() {
        this.dialog.show()
    }

    private on_open() {
        this.background.run()
    }

    private on_save() {
        this.storyService.saveBackground({ 
            id: this.background_id, 
            name: this.form.name, 
            description: this.form.description,
            tags: this.form.tags,
        } as Background, this.story)
        .then (() => this.dispatchEvent(new CustomEvent("update", { bubbles: true, composed: true })))
        this.dialog.hide()
    }
}