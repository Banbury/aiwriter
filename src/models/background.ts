import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Background")
export class Background {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("background")
    background: number = 0;
    @JsonProperty("name", String)
    name: string = "";
    @JsonProperty("description")
    description?: string = undefined;
    @JsonProperty("tags", String)
    private _tags?: string = undefined;

    public get tags(): string[] {
        return this._tags?.split(",") ?? []
    }

    public set tags(val: any) {
        if (Array.isArray(val)) {
            this._tags = val.join(",")
        } else {
            this._tags = val
        }
    }

    @JsonProperty("tags")
    enabled: number = 0;
}

export const BackgroundTags = {
    location: "#ffcc00",
    character: "#3399ff" ,
    other: "#808080" ,
}