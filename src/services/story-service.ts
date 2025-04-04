import { JsonConvert } from "json2typescript"
import { Background } from "../models/background"
import { Story } from "../models/story"
import { Storyblock } from "../models/storyblock"

export class StoryService {
    windmill_base_url = process.env.WINDMILL_BASE_URL
    windmill_api_key = process.env.WINDMILL_API_KEY
    windmill_api_url = `${this.windmill_base_url}/jobs/run/p/u/admin2`
    windmill_job_url = `${this.windmill_base_url}/jobs_u/get`
    windmill_result_url = `${this.windmill_base_url}/jobs_u/completed/get_result_maybe`
    database = '$res:u/admin2/mysql_writer'

    HEADERS: Headers = new Headers(
        {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.windmill_api_key}`
        }
    )

    mapper = new JsonConvert()

    async getStories(): Promise<Story[]> {
        return this.executeScript("POST", "writer_get_stories")
            .then(res => {
                if (!res.ok) { 
                    throw new Error(res.status.toString()) 
                }
                return res.json().then(d => d.result as Story[])
            })
    }

    async getStory(id: number): Promise<Story> {
        return this.executeScript("POST", "writer_get_story_by_id", { id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => {
                return this.mapper.deserialize(d.result[0] as Story, Story)
            })
        })
    }

    async saveStory(story: Story) {
        if (story.id) {
            return this.updateStory(story)
        } else {
            return this.insertStory(story)
        }
    }

    private async insertStory(story: Story) {
        return this.executeScript("POST", "writer_insert_story", {
            name: story.name,
            description: story.description,
            model: story.model
        })
    }

    private async updateStory(story: Story) {
        return this.executeScript("POST", "writer_update_story", {
            id: story.id,
            name: story.name,
            description: story.description,
            model: story.model
        })
    }

    async deleteStory(id: number) {
        return this.executeScript("POST", "writer_delete_story", {
            id: id
        })
    }

    async getStoryBlocks(id: number): Promise<Storyblock[]> {
        return this.executeScript("POST", "writer_get_story_blocks", { id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => d.result as Storyblock[])
        })
    }

    async getBackground(id: number): Promise<Background> {
        return this.executeScript("POST", "writer_get_background_by_id", { id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => {
                return this.mapper.deserialize(d.result[0] as Background, Background)
            })
        })
    }

    async getBackgroundsForStory(id: number): Promise<Background[]> {
        return this.executeScript("POST", "writer_get_backgrounds_for_story", { id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => d.result as Background[])
        })
    }

    async enableBackground(id: number, enabled: boolean) {
        return this.executeScript("POST", "writer_enable_background", { id: id, enabled: Number(enabled) })
    }

    async saveBackground(background: Background, story?: number) {
        if (background.id > 0) {
            return this.updateBackground(background)
        } else {
            if (story) {
                return this.insertBackground(background, story)
            }
            throw new Error("Story is undefined.")
        }
    }

    private async insertBackground(background: Background, story: number) {
        return this.executeScript("POST", "writer_insert_background", {
            story: story,
            name: background.name,
            description: background.description,
            tags: background.tags.join(",")
        })
    }

    private async updateBackground(background: Background) {
        return this.executeScript("POST", "writer_update_background", {
            id: background.id,
            name: background.name,
            description: background.description,
            tags: background.tags.join(",")
        })
    }

    private async getResult(id: string): Promise<Response> {
        let status = null
        while (!status?.success) {
            status = await this.getJobResultStatus(id)
        }
        return this.getJobResult(id);
    }

    private async executeScript(method = "POST", name: string, body={}): Promise<Response> {
        return fetch(`${this.windmill_api_url}/${name}`, 
            {
                method: method,
                headers: this.HEADERS,
                body: JSON.stringify({
                    database: this.database,
                    ...body
                }),
            }
        ).then(async (res) => {
            return res.text()
        }).then(async (job) => {
            return this.getResult(job);
        })
    }

    private async getJobResultStatus(id: string): Promise<any> {
        return fetch(`${this.windmill_job_url}/${id}`, 
            {
                method: "GET",
                headers: this.HEADERS,
            }
        )
        .then(res => res.json())
    }

    private async getJobResult(id: string): Promise<Response> {
        return fetch(`${this.windmill_result_url}/${id}`, 
            {
                method: "GET",
                headers: this.HEADERS,
            }
        )
    }
}

