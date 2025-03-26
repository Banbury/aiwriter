import { LitElement, html, TemplateResult, css, unsafeCSS } from "lit"
import { customElement, state, property } from 'lit/decorators.js'
import { Task } from '@lit/task'

@customElement('story-editor')
export class Storylist extends LitElement {
    @property() private story: number

    protected render(): TemplateResult {
        return html`
            <link href="./app.css" rel="stylesheet">
            <div class="grid gap-2 overflow-y-auto p-2">
                <div class="bg-amber-400">Story Editor</div>
            </div>
        `
    }
}