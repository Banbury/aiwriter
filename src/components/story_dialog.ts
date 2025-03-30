import { LitElement, html, TemplateResult, css, PropertyValues } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'
import { Task } from '@lit/task'
import { StoryService } from "../services/story-service"
import { SlDialog} from "@shoelace-style/shoelace"

import "./story_form"
import { StoryForm } from "./story_form"
import { Story } from "../models/story"

@customElement("story-dialog")
export class StoryDialog extends LitElement {
    @property({ attribute: "story"}) story_id: number

    private storyService = new StoryService()

    @query("#dialog")
    private dialog: SlDialog

    @query("#form")
    private form: StoryForm

    private story = new Task(this, {
        task: async ([id], {signal}): Promise<Story> => {
            const res = await new StoryService().getStory(id)
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(o => o.result[0])
        },
        autoRun: false,
        args: () => [this.story_id]
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
            <sl-button variant="text" @click="${this.on_open}"><sl-icon name="pencil-square"></sl-icon></sl-button>
            <sl-dialog id="dialog" label="Story">
                <div>
                    ${this.story.render({
                        pending: () => html`<p>Loading...</p>`,
                        complete: (value) => html`
                        <story-form id="form" .story=${value}></story-form>
                        `,
                        error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
                    })}
                </div>
                <sl-button variant="primary" slot="footer" @click="${this.on_save}">Save</sl-button>
            </sl-dialog>
        </div>
        `
    }

    private on_open() {
        if (this.story_id) {
            this.story.run()
        }
        this.dialog.show()
    }

    private on_save() {
        this.storyService.saveStory({ 
            id: this.story_id, 
            name: this.form.name, 
            description: this.form.description 
        })
        .then (() => this.dispatchEvent(new CustomEvent("update", { bubbles: true, composed: true })))
        this.dialog.hide()
    }
}