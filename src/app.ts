import { LitElement, PropertyValues, css, html } from "lit"
import { Task } from "@lit/task";
import { customElement, property, query, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';

import SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import SlDialog from "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import SlSelect from "@shoelace-style/shoelace/dist/components/select/select.js";

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import "./components/titlebar";
import "./components/storylist";
import "./components/storyeditor"
import "./components/background_button"
import "./components/background_list"

import { LLMService } from "./services/llm-service";
import { StoryService } from "./services/story-service";
import { Story } from "./models/story";

setBasePath('./assets/shoelace');

@customElement("main-window")
class MainWindow extends LitElement {
    @state() private story: Story

    @query("#sidebar") private sidebar: SlDrawer

    @query("#dialog") private dialog: SlDialog

    @query("#modelSelect") private modelSelect: SlSelect

    private readonly llmService = new LLMService()
    private readonly storyService = new StoryService()

    private models = new Task(this, {
        task: async ([], {signal}): Promise<string[]> => this.llmService.getModels(),
        autoRun: true,
        args: () => []
    })

    static styles = css`
        sl-dialog::part(base) {
            color: black;
        }
    `

    render() {
        return html`
        <link href="./app.css" rel="stylesheet">

        <div class="flex min-h-screen flex-col">
            <title-bar title="AI Writer">
                <div slot="toolbar" class="gap-2">
                    <background-button ?hidden=${!this.story} @click="${this.on_background}"></background-button>
                    <icon-button icon="gear" @click=${this.on_open}></icon-button>
                </div>
            </title-bar>
            
            <div class="grid grid-cols-3 gap-2 p-2 grow">
                <story-list class="border border-light-border" @selected="${this.on_story_selected}"></story-list>
                <story-editor .story=${this.story} class="border border-light-border col-span-2"></story-editor>
            </div>
        </div>

        <sl-drawer id="sidebar" label="Background">
            <div>
                <sl-select id="modelSelect" hoist value=${this.story?.model} @sl-change=${this.on_model_changed}>
                    ${this.models.render({
                        pending: () => html`<p>Loading...</p>`,
                        complete: (value) => html`
                        ${value.map(m => html`
                        <sl-option value=${m}>${m}</sl-option>
                        `)}
                        `,
                        error: (error) => html`<p>Oops, something went wrong: ${error}</p>`,
                    })}
                </sl-select>
            </div>
            <background-list story=${this.story}></background-list>
        </sl-drawer>
        <sl-dialog id="dialog" label="Settings">
            <sl-button variant="primary" slot="footer" @click="${this.on_saveSettings}">Save</sl-button>
        </sl-dialog>
        `
    }

    private on_story_selected(e: CustomEvent) {
        this.story = e.detail.story
    }

    private on_model_changed() {
        const model = this.modelSelect.value as string
        this.storyService.saveStoryModel(this.story.id, model)
        this.story = { ...this.story,  model: model }
    }

    private on_background() {
        this.sidebar.show()
    }

    private on_open() {
        this.dialog.show()
    }

    private on_saveSettings() {

    }
}