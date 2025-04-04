import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup, PropertyDeclaration } from "lit"
import {customElement, property, query, state} from 'lit/decorators.js'
import { Task } from '@lit/task'

import { SlButton, SlSelect, SlSwitch } from "@shoelace-style/shoelace"

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

    @query("#selectBackground")
    private selectBackground: HTMLSpanElement

    @query("#link")
    private linkButton: SlButton

    private readonly storyService = new StoryService()

    private backgrounds = new Task(this, {
        task: async ([id], {signal}): Promise<Background[]> => this.storyService.getBackgroundsForStory(id),
        autoRun: true,
        args: () => [this.story]
    })

    private allBackgrounds = new Task(this, {
        task: async ([id], {signal}): Promise<Background[]> => this.storyService.getBackgroundsNotInStory(id),
        autoRun: false,
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
                        <div class="flex flex-row gap-1">
                            ${b.tags.map((t: string) => html`
                            <sl-tag size="small" pill>${t}</sl-tag>
                            `
                            )}
                        </div>
                        <div class="invisible group-hover:visible flex flex-row">
                            <icon-button icon="pencil-square" @click="${() => this.on_edit(b.id)}"></icon-button>
                            <icon-button class="trash" icon="trash" @click=${() => this.on_unlink(b.background)}></icon-button>
                        </div>
                        <sl-switch id="switch" ?checked=${!!b.enabled} @sl-change=${(e: any) => this.on_switched(e, b.id)}></sl-switch>
                    </div>
                    `
                )}`,
                error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
            })}
            <!-- Toolbar -->
            <div class="w-full flex flex-row">
                <icon-button id="link" icon="link" @click=${this.on_link}></icon-button>
                <span id="selectBackground" class="flex flex-row" hidden>
                    <sl-select pill size="small">
                        ${this.allBackgrounds.render({
                            pending: () => html`<p>Loading...</p>`,
                            complete: (value) => html`
                                ${value.map((b: Background) => html`
                                <sl-option value=${b.id}>${b.name} (${b.tags})</sl-option>
                                `
                            )}`,
                        error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
                        })}
                    </sl-select>
                    <sl-button variant="success" size="small" circle @click=${this.on_link_accept}>
                        <sl-icon name="plus"></sl-icon>
                    </sl-button>
                    <sl-button variant="danger" size="small" circle @click=${this.on_link_cancel}>
                        <sl-icon name="x"></sl-icon>
                    </sl-button>
                </span>
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
        this.allBackgrounds.run()
        this.selectBackground.hidden = false
        this.linkButton.hidden = true
    }

    private on_link_accept() {
        let value = (this.selectBackground.querySelector("sl-select") as SlSelect).value
        if (value) {
            this.selectBackground.hidden = true
            this.linkButton.hidden = false
            this.storyService.addBackgroundToStory(this.story, +value)
                .then(() => this.backgrounds.run())
        }
    }

    private on_link_cancel() {
        this.selectBackground.hidden = true
        this.linkButton.hidden = false
    }

    private on_unlink(id: number) {
        this.storyService.removeBackgroundFromStory(this.story, id)
            .then(() => this.backgrounds.run())
    }
}