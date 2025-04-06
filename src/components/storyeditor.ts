import { LitElement, html, TemplateResult, PropertyValues, css } from "lit"
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state, property, query } from 'lit/decorators.js'
import { Task } from '@lit/task'

import { marked } from 'marked';

import { StoryService } from "../services/story-service"
import { Storyblock } from "../models/storyblock"

import { LLMService } from "../services/llm-service";

import "./chat_input"

@customElement('story-editor')
export class StoryEditor extends LitElement {
    @property() private story: number

    private readonly llmService = new LLMService()

    private storyblocks = new Task(this, {
        task: async ([story], {signal}) => new StoryService().getStoryBlocks(story),
        args: () => [this.story]
    })

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
                        ${value.map((s: Storyblock) => html`
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
            <chat-input ?hidden=${ !this.story } @send=${this.on_send} @abort=${this.on_abort}></chat-input>
        </div>
        `
    }

    private on_update() {
        this.storyblocks.run()
    }

    private on_delete(id: number) {

    }

    private on_send(e: CustomEvent) {
        const userPrompt = e.detail.prompt
    }

    private on_abort() {
    }
}