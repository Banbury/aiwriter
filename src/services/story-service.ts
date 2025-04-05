import { JsonConvert } from "json2typescript"
import { Background } from "../models/background"
import { Story } from "../models/story"
import { Storyblock } from "../models/storyblock"

import { WindmillService } from "./windmill-service"

export class StoryService {
    windmillService = new WindmillService()

    database = '$res:u/admin2/mysql_writer'

    mapper = new JsonConvert()

    async getStories(): Promise<Story[]> {
        return this.windmillService.executeScript("POST", "writer_get_stories", { database: this.database })
            .then(res => {
                if (!res.ok) { 
                    throw new Error(res.status.toString()) 
                }
                return res.json().then(d => d.result as Story[])
            })
    }

    async getStory(id: number): Promise<Story> {
        return this.windmillService.executeScript("POST", "writer_get_story_by_id", { database: this.database, id: id })
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
        return this.windmillService.executeScript("POST", "writer_insert_story", {
            database: this.database,
            name: story.name,
            description: story.description,
            model: story.model
        })
    }

    private async updateStory(story: Story) {
        return this.windmillService.executeScript("POST", "writer_update_story", {
            database: this.database,
            id: story.id,
            name: story.name,
            description: story.description,
            model: story.model
        })
    }

    async deleteStory(id: number) {
        return this.windmillService.executeScript("POST", "writer_delete_story", {
            database: this.database,
            id: id
        })
    }

    async getStoryBlocks(id: number): Promise<Storyblock[]> {
        return this.windmillService.executeScript("POST", "writer_get_story_blocks", { database: this.database, id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => d.result as Storyblock[])
        })
    }

    async getBackgrounds(): Promise<Background[]> {
        return this.windmillService.executeScript("POST", "writer_get_backgrounds", { database: this.database })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => d.result as Background[])
        })
    }

    async getBackground(id: number): Promise<Background> {
        return this.windmillService.executeScript("POST", "writer_get_background_by_id", { database: this.database, id: id })
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
        return this.windmillService.executeScript("POST", "writer_get_backgrounds_for_story", { database: this.database, id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => d.result.map((r: Background) => this.mapper.deserialize(r, Background)) as Background[])
        })
    }

    async getBackgroundsNotInStory(id: number): Promise<Background[]> {
        return this.windmillService.executeScript("POST", "writer_get_backgrounds_not_in_story", { database: this.database, id: id })
        .then(res => {
            if (!res.ok) { 
                throw new Error(res.status.toString()) 
            }
            return res.json().then(d => d.result as Background[])
        })
    }

    async enableBackground(id: number, enabled: boolean) {
        return this.windmillService.executeScript("POST", "writer_enable_background", { database: this.database, id: id, enabled: Number(enabled) })
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
        return this.windmillService.executeScript("POST", "writer_insert_background", {
            database: this.database,
            story: story,
            name: background.name,
            description: background.description,
            tags: background.tags.join(",")
        })
    }

    private async updateBackground(background: Background) {
        return this.windmillService.executeScript("POST", "writer_update_background", {
            database: this.database,
            id: background.id,
            name: background.name,
            description: background.description,
            tags: background.tags.join(",")
        })
    }

    async addBackgroundToStory(story: number, background: number) {
        return this.windmillService.executeScript("POST", "writer_add_background_to_story", {
            database: this.database,
            story: story,
            background: background
        })
    }

    async removeBackgroundFromStory(story: number, background: number) {
        return this.windmillService.executeScript("POST", "writer_remove_background_from_story", {
            database: this.database,
            story: story,
            background: background
        })
    }
}

