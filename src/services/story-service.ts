import { Story } from "../models/story"

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

    async getStories(): Promise<Response> {
        return this.executeScript("POST", "writer_get_stories")
    }

    async getStory(id: number): Promise<Response> {
        return this.executeScript("POST", "writer_get_story_by_id", { id: id })
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

    async getStoryBlocks(id: number): Promise<Response> {
        return this.executeScript("POST", "writer_get_story_blocks", { id: id })
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

