import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Story")
export class Story {
    @JsonProperty("id", Number)
    id: number = 0;
    @JsonProperty("name", String)
    name: string = "";
    @JsonProperty("description")
    description?: string = undefined;
    @JsonProperty("model")
    model?: string = undefined;
}