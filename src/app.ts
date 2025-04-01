import { LitElement, PropertyValues, html } from "lit"
import { customElement, property, query, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';

import SlDrawer from "@shoelace-style/shoelace/dist/components/drawer/drawer.js";

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

import "./components/titlebar";
import "./components/storylist";
import "./components/storyeditor"
import "./components/settings_dialog"
import "./components/background_button"
import "./components/background_form"

setBasePath('./assets/shoelace');

@customElement("main-window")
class MainWindow extends LitElement {
    @state() private story: number

    @query("#sidebar") private sidebar: SlDrawer

    render() {
        return html`
        <link href="./app.css" rel="stylesheet">

        <div class="flex min-h-screen flex-col">
            <title-bar title="AI Writer">
                <div slot="toolbar" class="gap-2">
                    <background-button ?hidden=${!this.story} @click="${this.on_background}"></background-button>
                    <settings-dialog @click="${this.on_settings}"></settings-dialog>
                </div>
            </title-bar>
            <!-- <sl-button>Button</sl-button> -->
            <div class="grid grid-cols-3 gap-2 p-2 grow">
                <story-list class="border border-light-border" @selected="${this.on_story_selected}"></story-list>
                <story-editor story=${this.story} class="border border-light-border col-span-2"></story-editor>
            </div>
        </div>

        <sl-drawer id="sidebar" label="Background">
            <background-form story=${this.story}></background-form>
        </sl-drawer>
        `
    }

    private on_story_selected(e: CustomEvent) {
        this.story = e.detail.story
    }

    private on_background() {
        this.sidebar.show()
    }

    private on_settings() {
        alert("Settings");
    }
}