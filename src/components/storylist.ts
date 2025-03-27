import { LitElement, html, TemplateResult } from "lit"
import {customElement, state} from 'lit/decorators.js'
import { Task } from '@lit/task'

import { Story } from '../models/story'
import { StoryService } from "../services/story-service"

import "./story_dialog"

@customElement('story-list')
export class Storylist extends LitElement {
    @state() private story: number

    constructor() {
        super();
        this.addEventListener("update", e => this.stories.run())
    }

    private stories = new Task(this, {
        task: async ([], {signal}) => {
            const res = await new StoryService().getStories()
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json()
        },
        args: () => []
    })

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="grid gap-2 p-2 overflow-y-auto">
            ${this.stories.render({
                pending: () => html`<p>Loading...</p>`,
                complete: (value) => html`
                    ${value.result.map((s: Story) => html`
                    <div class="flex flex-row border border-light-border cursor-pointer p-1 h-fit ${this.story == s.id ? 'selected' : 'bg-white'}" @click="${(e: Event) => this.on_click(s.id)}">
                        <div class="grow">${s.name}</div>
                        <story-dialog story="${s.id}"></story-dialog>
                    </div>
                    `
                )}
                `,
                error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
            })}
        </div>
        `
    }

    private on_click(id: number) {
        this.story = id
        this.dispatchEvent(new CustomEvent('story-selected', { detail: { story: id }, bubbles: true, composed: true }))
    }
}