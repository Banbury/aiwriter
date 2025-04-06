import { Story } from "../models/story";
import { StoryService } from "./story-service";
import { WindmillService } from "./windmill-service";

export class LLMService {
    private readonly windmillService = new WindmillService()
    private readonly storyService = new StoryService()
    
    stop() {
        this.windmillService.stop()
    }

    async ollamaChat(model: string, messages: { role: string, content: string }[], options: any = {}): Promise<string> {
        return this.windmillService.executeScript("POST", "ollama_chat", {
            model: model,
            messages: messages,
            options: options
        })
        .then((res: any) => res.json().then((d: any) => d.result["message"]["content"]))
    }
}