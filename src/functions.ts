import chalk from "chalk";
import {
    Guild,
    GuildMember,
    PermissionFlagsBits,
    PermissionResolvable,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import GuildDB from "./schemas/Guild";
import { GuildOption, IPrompt, Prompts } from "./types";
import mongoose from "mongoose";
import PromptModel from "./schemas/Prompt";

type colorType = "text" | "variable" | "error" | "links";

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c",
    links: "#7bbcde",
};

export const getThemeColor = (color: colorType) =>
    Number(`0x${themeColors[color].substring(1)}`);

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message);
};

export const checkPermissions = (
    member: GuildMember,
    permissions: Array<PermissionResolvable>
) => {
    let neededPermissions: PermissionResolvable[] = [];
    permissions.forEach((permission) => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission);
    });
    if (neededPermissions.length === 0) return null;
    return neededPermissions.map((p) => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
        else
            return Object.keys(PermissionFlagsBits)
                .find((k) => Object(PermissionFlagsBits)[k] === p)
                ?.split(/(?=[A-Z])/)
                .join(" ");
    });
};

export const sendTimedMessage = (
    message: string,
    channel: TextChannel,
    duration: number
) => {
    channel
        .send(message)
        .then((m) =>
            setTimeout(
                async () => (await channel.messages.fetch(m)).delete(),
                duration
            )
        );
    return;
};

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0)
        throw new Error("Database not connected.");
    let foundGuild = await GuildDB.findOne({ guildID: guild.id });
    if (!foundGuild) return null;
    return foundGuild.options[option];
};

export const setGuildOption = async (
    guild: Guild,
    option: GuildOption,
    value: any
) => {
    if (mongoose.connection.readyState === 0)
        throw new Error("Database not connected.");
    let foundGuild = await GuildDB.findOne({ guildID: guild.id });
    if (!foundGuild) return null;
    foundGuild.options[option] = value;
    foundGuild.save();
};

export const loadPrompts = (prompts: Prompts) => {
    try {
        let data : IPrompt[] = [];
        prompts.forEach(({ act, prompt }) => {
            let newPrompt = new PromptModel({
                role: act,
                prompt: prompt,
                createdAt: Date.now(),
            });
            data.push(newPrompt);
        });
        PromptModel.insertMany(data);
        console.log(
            color("text", "Successfully uploaded " + data.length + " prompts ✅")
        );
    } catch (e) {
        console.log(color("error", "Error uploading prompts: " + e));
    }
};

export const deleteAllPrompts = async () => {
    await PromptModel.deleteMany({});
    console.log(color("text", "Successfully deleted all prompts ✅"));
}

export const getPromptByRole = async (role: string) => {
    let prompt = await PromptModel.findOne({ role: role });
    if (!prompt) return [];
    return prompt.prompt;
};

export const allPromptRoles = async () => {
    // get an array of existing roles in the database
    let prompts = await PromptModel.find().distinct("role");
    prompts = prompts.slice(0, 25);
    console.log(prompts);
    if (!prompts) return [];
    return prompts
}

