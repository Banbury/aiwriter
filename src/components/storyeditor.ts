import { LitElement, html, TemplateResult, PropertyValues } from "lit"
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { customElement, state, property } from 'lit/decorators.js'
import { Task } from '@lit/task'

import { marked } from 'marked';

import { StoryService } from "../services/story-service"
import { Storyblock } from "../models/storyblock"

@customElement('story-editor')
export class StoryEditor extends LitElement {
    @property() private story: number

    private stories = new Task(this, {
        task: async ([story], {signal}) => {
            if (this.story) {
                const res = await new StoryService().getStoryBlocks(story)
                if (!res.ok) { 
                    throw new Error(res.status.toString()) 
                }
                return res.json()
            }
            return { result: [] }
        },
        args: () => [this.story]
    })

    protected updated(_changedProperties: PropertyValues): void {
        super.updated(_changedProperties)
    }

    protected render(): TemplateResult {
        return html`
            <link href="./app.css" rel="stylesheet">
        <div class="grid gap-2 p-2 overflow-y-auto">
            ${this.stories.render({
                pending: () => html`<p>Loading...</p>`,
                complete: (value) => html`
                    ${value.result.map((s: Storyblock) => html`
                    <div class="border border-light-border cursor-pointer block w-auto p-1 h-fit bg-white">${unsafeHTML(marked.parse(s.text, { async: false }))}</div>
                    `)}
                `,
                error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
            })}
        </div>
        `
    }
}