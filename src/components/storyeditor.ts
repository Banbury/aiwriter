import { LitElement, html, TemplateResult, PropertyValues, css } from "lit"
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { customElement, state, property } from 'lit/decorators.js'
import { Task } from '@lit/task'

import { marked } from 'marked';

import { StoryService } from "../services/story-service"
import { Storyblock } from "../models/storyblock"
import { LLMService } from "../services/llm-service";

@customElement('story-editor')
export class StoryEditor extends LitElement {
    @property() private story: number

    private readonly llmService = new LLMService()

    private input: HTMLInputElement | null

    private storyblocks = new Task(this, {
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

    static styles = css`
        sl-details::part(header) {
            height: 0px;
        }

        sl-button[variant="text"] {
            width: 25px;
        }

        sl-button[variant="text"]::part(base) {
            color: black;
        }

        sl-button[variant="text"]::part(base):hover {
            color: red;
        }

        .corner {
            bottom: 8px;
            right: 8px;
        }
    `

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="h-full flex flex-col">
            <div class="p-2 overflow-y-auto grow flex flex-col gap-2">
                ${this.storyblocks.render({
                    pending: () => html`<p>Loading...</p>`,
                    complete: (value) => html`
                        ${value.result.map((s: Storyblock) => html`
                        <div class="group relative border border-light-border cursor-pointer w-auto p-2 h-fit flex flex-col gap-2 bg-white">
                            <sl-details summary="User Prompt">${unsafeHTML(marked.parse(s.prompt ?? "", { async: false }))}</sl-details>
                            <div>
                                ${unsafeHTML(marked.parse(s.text, { async: false }))}
                            </div>
                            <div class="absolute corner invisible group-hover:visible flex flex-row">
                                <story-dialog story="${s.id}" @update="${this.on_update}"></story-dialog>
                                <sl-button variant="text" @click="${() => this.on_delete(s.id)}"><sl-icon name="trash"></sl-icon></sl-button>
                            </div>
                        </div>
                        `)}
                    `,
                    error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
                })}
            </div>
            <div ?hidden=${ !this.story } class="bg-white flex flex-row gap-2 p-2" style="box-shadow: 0px -4px 6px 0px rgba(0, 0, 0, 0.1);">
                <textarea id="input" rows="3" class="border rounded border-light-border text-sm h-full grow"></textarea>
                <sl-button variant="primary" @click="${this.on_send()}">
                    Send <sl-icon name="send"></sl-icon>
                </sl-button>
            </div>
        </div>
        `
    }

    private on_send() {
        this.dispatchEvent(new CustomEvent('send', { detail: { prompt: this.input?.innerText }, bubbles: true, composed: true }))
    }

    private on_update() {
        this.storyblocks.run()
    }

    private on_delete(id: number) {

    }

}