import { Story } from "../models/story";
import { WindmillService } from "./windmill-service";

export class LLMService {
    windmillService = new WindmillService()
    
    async writeStory(story: Story, userPrompt: string) {
        return this.getPrompt(story.id)
    }

    stop() {
        this.windmillService.stop()
    }

    private async ollamaChat(model: string, messages: { role: string, content: string }[], options?: any) {
        return this.windmillService.executeScript("POST", "writer_get_story_prompt", {
            model: model,
            messages: messages,
            options: options
        })
        .then((res: any) => res["message"]["content"])
    }

    private async getPrompt(story: number): Promise<string> {
        return this.windmillService.executeScript("POST", "writer_get_story_prompt", {
            story: story
        })
        .then(res => res.text())
    }

}