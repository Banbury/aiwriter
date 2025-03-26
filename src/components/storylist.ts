import { LitElement, html, TemplateResult } from "lit"
import {customElement, state} from 'lit/decorators.js'
import { Task } from '@lit/task'

import { Story } from '../models/story'
import { StoryService } from "../services/story-service"

@customElement('story-list')
export class Storylist extends LitElement {
    @state() private story: number

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
                    <div class="border border-light-border cursor-pointer block w-auto p-1 h-fit ${this.story == s.id ? 'selected' : 'bg-white'}" @click="${(e: Event) => this.onClick(s.id)}">${s.name}</div>
                    `)}
                `,
                error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
            })}
        </div>
        `
    }

    private onClick(id: number) {
        console.log("Click!", id)
        this.story = id
        this.dispatchEvent(new CustomEvent('story-selected', { detail: { story: id } }))
    }
}