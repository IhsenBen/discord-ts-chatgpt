import { Schema, model } from "mongoose";
import { IPrompt } from "../types";

const PromptSchema = new Schema<IPrompt>({
    role: {required:true, type: String},
    prompt: {required:true, type: String},
})

const PromptModel = model("prompt", PromptSchema)

export default PromptModel