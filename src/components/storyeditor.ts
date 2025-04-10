import { LitElement, html, TemplateResult, PropertyValues, css } from "lit"
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state, property, query } from 'lit/decorators.js'
import { Task } from '@lit/task'

import { marked } from 'marked';

import { StoryService } from "../services/story-service"
import { WindmillService } from "../services/windmill-service";
import { Storyblock } from "../models/storyblock"

import "./chat_input"
import { ChatInput } from "./chat_input";
import { Story } from "../models/story";

@customElement('story-editor')
export class StoryEditor extends LitElement {
    @property() story: Story

    @state() private editMode = 0

    @query("chat-input")
    private chatInput: ChatInput

    @query("#list")
    private list: HTMLDivElement

    @query("sl-textarea")
    private editor: HTMLTextAreaElement

    private readonly windmillService = new WindmillService()
    private readonly storyService = new StoryService()

    private storyblocks = new Task(this, {
        task: async ([story], {signal}) => story ? new StoryService().getStoryBlocks(story.id) : [],
        args: () => [this.story]
    })

    static styles = css`
        sl-details::part(header) {
            height: 0px;
        }

        icon-button[icon="trash"]:hover {
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
        <div class="flex flex-col" style="height: calc(100vh - 63px);">
            <div id="list" class="p-2 overflow-y-auto grow flex flex-col gap-2">
                ${this.storyblocks.render({
                    pending: () => html`<p>Loading...</p>`,
                    complete: (value) => html`
                        ${value.map((s: Storyblock) => html`
                        <div class="group relative border border-light-border cursor-pointer w-auto p-2 h-fit flex flex-col gap-2 bg-white">
                            <sl-details summary="User Prompt">${unsafeHTML(marked.parse(s.prompt ?? "", { async: false }))}</sl-details>
                            ${(this.editMode != s.id) ? html`
                            <div class="p-2">
                                ${unsafeHTML(marked.parse(s.text, { async: false }))}
                            </div>
                            <div class="absolute corner invisible group-hover:visible flex flex-row">
                                <icon-button icon="pencil-square" @click=${() => this.on_edit(s.id)}></icon-button>
                                <icon-button icon="trash" @click=${() => this.on_delete(s.id)}></icon-button>
                            </div>
                            ` : html`
                            <sl-textarea resize="auto" class="p-2 border border-light-border h-fit" .value= ${s.text}></sl-textarea>
                            <div class="flex flex-row gap-2">
                                <sl-button @click=${this.on_save}>Save</sl-button>
                                <sl-button @click=${this.on_cancelEdit}>Cancel</sl-button>
                            </div>
                            `
                            }
                        </div>
                        `)}
                    `,
                    error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
                })}
            </div>
            <chat-input class="relative" ?hidden=${ !this.story } @send=${(e: CustomEvent) => this.on_send(e.detail.prompt)} @abort=${this.on_abort}></chat-input>
        </div>
        `
    }

    protected updated(changedProperties: PropertyValues): void {
        if (changedProperties.has('editMode') && this.editor) {
            this.editor.parentElement?.scrollIntoView({ behavior: "smooth" })
        }
    }

    private on_update() {
        this.storyblocks.run()
    }

    private on_edit(id: number) {
        this.editMode = id
    }

    private on_cancelEdit() {
        this.editMode = 0
    }

    private on_save() {
        if (this.storyblocks.value) {
            const block = this.storyblocks.value.find(sb => sb.id == this.editMode)
            if (block) {
                block.text = this.editor.value
                this.storyService.saveStoryBlock(block)
            }
        }
        this.editMode = 0
    }

    private on_delete(id: number) {
        this.storyService.getStoryBlock(id)
        .then(b => this.chatInput.value = b.prompt)
        .then(() => this.storyService.deleteStoryBlock(id))
        .then(() => this.storyblocks.run())
    }

    private async on_send(userPrompt: string) {
        this.storyService.writeStory(this.story, userPrompt)
            .then(c => this.storyService.saveStoryBlock(
                {
                    id: 0,
                    story: this.story.id,
                    prev: this.storyblocks.value?.slice(-1).pop()?.id ?? 0,
                    prompt: userPrompt,
                    text: c
                }
            ))
            .then(() => this.storyblocks.run())
            .then(() => this.list.lastElementChild?.scrollIntoView({ behavior: "smooth" }))
            .then(() => this.chatInput.enable())
    }

    private on_abort() {
        this.windmillService.stop()
    }
}