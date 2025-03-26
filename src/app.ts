// import "./styles/main.css"
import { LitElement, html } from "lit"
import {customElement, property} from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import "./components/titlebar";
import "./components/storylist";
import "./components/storyeditor"

import { StoryService } from "./services/story-service";
import { Story } from "./models/story";

setBasePath('./assets/shoelace/dist');

@customElement("main-window")
class MainWindow extends LitElement {

    constructor() {
        super()
    }

    render() {
        return html`
        <link href="./app.css" rel="stylesheet">

        <div class="flex min-h-screen flex-col">
            <title-bar title="AI Writer"></title-bar>
            <!-- <sl-button>Button</sl-button> -->
            <div class="grid grid-cols-3 gap-2 p-2 grow">
                <story-list class="border border-light-border"></story-list>
                <story-editor class="border border-light-border col-span-2"></story-editor>
            </div>
        </div>
        `
    }
}