import { LitElement, html, TemplateResult, css } from "lit"
import { customElement, query, state } from 'lit/decorators.js'
import { Task } from '@lit/task'

import { Story } from '../models/story'
import { StoryService } from "../services/story-service"

import "./story_dialog"
import "./new_story_dialog"
import "./message_box"
import { MessageBox } from "./message_box"

@customElement('story-list')
export class Storylist extends LitElement {
    @state() private story: number | undefined

    @query("#delete_story_msg")
    messageBoxDeletStory: MessageBox

    private readonly storyService = new StoryService()

    private stories = new Task(this, {
        task: async ([], {signal}) => this.storyService.getStories(),
        args: () => []
    })

    static styles = css`
        sl-button[variant="text"] {
            width: 25px;
        }

        sl-button[variant="text"]::part(base) {
            color: black;
        }

        sl-button[variant="text"]::part(base):hover {
            color: red;
        }

        new-story-dialog {
            bottom: 8px;
            right: 8px;
        }
    `

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="flex flex-col gap-2 p-2 overflow-y-auto h-full relative">
            ${this.stories.render({
                pending: () => html`<p>Loading...</p>`,
                complete: (value) => html`
                    ${value.map((s: Story) => html`
                    <div class="group flex flex-row border border-light-border cursor-pointer p-1 h-fit ${this.story == s.id ? 'selected' : 'bg-white'}" @click="${(e: Event) => this.on_click(s.id)}">
                        <div class="grow flex items-center">${s.name}</div>
                        <div class="invisible group-hover:visible flex flex-row">
                            <story-dialog story="${s.id}" @update="${this.on_update}"></story-dialog>
                            <sl-button variant="text" @click="${() => this.on_delete(s.id)}"><sl-icon name="trash"></sl-icon></sl-button>
                        </div>
                    </div>
                    `
                )}
                `,
                error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
            })}
            <new-story-dialog class="absolute" @update=${this.on_update}></new-story-dialog>
            <message-box id="delete_story_msg" type=2 title="Delete Story" message="Do you want to delete this story?"></message-box>
        </div>
        `
    }

    private on_update() {
        this.stories.run()
    }

    private on_click(id: number) {
        this.story = id
        this.dispatchEvent(new CustomEvent('selected', { detail: { story: id }, bubbles: true, composed: true }))
    }

    private on_delete(id: number) {
        this.messageBoxDeletStory.show(() => {
            this.storyService.deleteStory(id)
            .then(() => this.stories.run())
        })
    }
}