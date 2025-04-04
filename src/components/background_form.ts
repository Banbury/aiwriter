import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup, PropertyDeclaration } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'
import { Task } from '@lit/task'
import { SlInput, SlTextarea } from "@shoelace-style/shoelace"

import "./tag_list"

import { Background } from "../models/background"
import { TagList } from "./tag_list"

@customElement("background-form")
export class BackgroundForm extends LitElement {
    @property() background: Background

    @query("#name")
    private nameInput: SlInput

    @query("#description")
    private descriptionTextarea: SlTextarea

    @query("tag-list")
    private tagList: TagList

    public get name(): string {
        return this.nameInput.value
    }

    public get description(): string {
        return this.descriptionTextarea.value
    }

    public get tags(): string[] {
        return this.tagList.tags
    }

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="flex flex-col gap-2">
            <sl-input id="name" label="Name" value=${this.background.name} required></sl-input>
            <sl-textarea id="description" label="Description" rows="5" value=${this.background.description}></sl-textarea>
            <tag-list .tags=${this.background.tags}></tag-list>
        </div>
        `
    }
}