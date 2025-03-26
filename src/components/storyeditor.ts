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

    private input: HTMLInputElement | null

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

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.input = this.renderRoot.querySelector("#input")
    }

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="h-full flex flex-col">
            <div class="p-2 overflow-y-auto grow flex flex-col gap-2">
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
            <div ?hidden=${ !this.story } class="bg-white flex flex-row gap-2 p-2" style="box-shadow: 0px -4px 6px 0px rgba(0, 0, 0, 0.1);">
                <textarea id="input" rows="3" class="border rounded border-light-border text-sm h-full grow"></textarea>
                <sl-button variant="primary" @click="${this.onSend()}">
                    Send <sl-icon name="send"></sl-icon>
                </sl-button>
            </div>
        </div>
        `
    }

    private onSend() {
        this.dispatchEvent(new CustomEvent('send', { detail: { prompt: this.input?.innerText }, bubbles: true, composed: true }))
    }
}