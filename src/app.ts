import { LitElement, PropertyValues, html } from "lit"
import { customElement, property, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import "./components/titlebar";
import "./components/storylist";
import "./components/storyeditor"

setBasePath('./assets/shoelace');

@customElement("main-window")
class MainWindow extends LitElement {
    @state() private story: number

    render() {
        return html`
        <link href="./app.css" rel="stylesheet">

        <div class="flex min-h-screen flex-col">
            <title-bar title="AI Writer"></title-bar>
            <!-- <sl-button>Button</sl-button> -->
            <div class="grid grid-cols-3 gap-2 p-2 grow">
                <story-list class="border border-light-border" @selected="${this.on_story_selected}"></story-list>
                <story-editor story=${this.story} class="border border-light-border col-span-2"></story-editor>
            </div>
        </div>
        `
    }

    private on_story_selected(e: CustomEvent) {
        this.story = e.detail.story
    }
}