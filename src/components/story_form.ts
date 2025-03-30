import { LitElement, html, TemplateResult, PropertyValues } from "lit"
import { customElement, property, query, state } from 'lit/decorators.js'
import { SlInput, SlTextarea } from "@shoelace-style/shoelace"

import { Story } from "../models/story"

@customElement("story-form")
export class StoryForm extends LitElement {
    @property() story: Story

    @query("#name")
    private nameInput: SlInput

    @query("#description")
    private descriptionTextarea: SlTextarea

    public get name() {
        return this.nameInput.value
    }

    public get description() {
        return this.descriptionTextarea.value
    }

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="flex flex-col gap-2">
            <sl-input id="name" label="Name" value=${this.story.name} required></sl-input>
            <sl-textarea id="description" label="Description" rows="5" value=${this.story.description}></sl-textarea>
        </div>
        `
    }
}