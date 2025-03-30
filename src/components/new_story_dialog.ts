import { LitElement, html, TemplateResult, PropertyValues, css } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'
import { SlDialog } from "@shoelace-style/shoelace"

import "./story_form"
import { StoryForm } from "./story_form"
import { Story } from "../models/story"
import { StoryService } from "../services/story-service"

@customElement("new-story-dialog")
export class NewStoryDialog extends LitElement {
    private storyService = new StoryService()
    private story = new Story()

    @query("#dialog")
    private dialog: SlDialog

    @query("#form")
    private form: StoryForm
    
    static styles = css`
        sl-dialog::part(base) {
            color: black;
        }

        #new::part(base) {
            font-size: 24px;
        }
    `

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <sl-button id="new" variant="primary" size="medium" circle @click="${this.on_click}">
            <sl-icon name="plus"></sl-icon>
        </sl-button>
        <sl-dialog id="dialog" label="New Story">
            <story-form id="form" .story=${this.story}></story-form>
            <sl-button variant="primary" slot="footer" @click="${this.on_create}">Create</sl-button>
        </sl-dialog>
        `
    }

    private on_click() {
        this.dialog.show()
    }

    private on_create() {
        if (this.form.name) {
            this.storyService.saveStory({ id: 0, name: this.form.name, description: this.form.description })
            .then(() => {
                this.dialog.hide()
                this.dispatchEvent(new CustomEvent("update", { bubbles: true, composed: true }))
            })
        }
    }
}
