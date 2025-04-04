import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup, PropertyDeclaration } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'
import { Task } from '@lit/task'

import { SlSwitch } from "@shoelace-style/shoelace"

import { StoryService } from "../services/story-service"
import { Background } from "../models/background"
import { BackgroundDialog } from "./background_dialog"

import "./icon_button"
import "./background_dialog"

@customElement("background-list")
export class BackgroundList extends LitElement {
    @property() story: number

    @query("#switch")
    private readonly switch: SlSwitch

    @query("background-dialog")
    private backgroundDialog: BackgroundDialog

    private readonly storyService = new StoryService()

    private backgrounds = new Task(this, {
        task: async ([id], {signal}): Promise<Background[]> => this.storyService.getBackgroundsForStory(id),
        autoRun: true,
        args: () => [this.story]
    })

    requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration): void {
        if (name === "story") {
            this.backgrounds.run()
        }
        super.requestUpdate(name, oldValue, options)
    }

    static styles = css`
    .trash:hover {
        color: red;
    }
    `

    protected render(): TemplateResult {
        return html`
        <link href="./app.css" rel="stylesheet">
        <div class="flex flex-col gap-2 p-2 overflow-y-auto h-full relative">
            ${this.backgrounds.render({
                pending: () => html`<p>Loading...</p>`,
                complete: (value) => html`
                    ${value.map((b: Background) => html`
                    <div class="group flex flex-row border border-light-border cursor-pointer p-1 h-fit bg-white">
                        <span class="grow">${b.name}</span>
                        <div class="invisible group-hover:visible flex flex-row">
                            <icon-button icon="pencil-square" @click="${() => this.on_edit(b.id)}"></icon-button>
                            <icon-button class="trash" icon="trash"></icon-button>
                        </div>
                        <sl-switch id="switch" ?checked=${!!b.enabled} @sl-change=${(e: any) => this.on_switched(e, b.id)}></sl-switch>
                    </div>
                    `
                )}
                `,
                error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
            })}
            <div class="w-full flex flex-row">
                <icon-button icon="link"></icon-button>
                <icon-button icon="file-plus" @click=${this.on_new}></icon-button>
            </div>

            <background-dialog story=${this.story} @update=${this.on_update}></background-dialog>
        </div>    
        `
    }

    private on_update() {
        this.backgrounds.run()
    }
 
    private on_edit(id: number) {
        this.backgroundDialog.background_id = id
        this.backgroundDialog.show()
    }

    private on_switched(e: any, id: number) {
        const enabled = e.target.checked
        this.storyService.enableBackground(id, enabled)
    }

    private on_new() {
        this.backgroundDialog.background_id = -1
        this.backgroundDialog.show()
    }

    private on_link() {

    }

    private on_unlink(id: number) {

    }
}