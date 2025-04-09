import { WindmillService } from "./windmill-service";

export class LLMService {
    private readonly windmillService = new WindmillService()
    
    stop() {
        this.windmillService.stop()
    }

    async getModels(): Promise<string[]> {
        return this.windmillService.executeScript("POST", "ollama_get_model_list", {
            "url": "http://192.168.1.109"
          })
            .then((res: any) => res.json().then((d: any) => d.result.models.map((m: any) => m.name).sort()))
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