import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Shows the bot's ping")
    ,
    execute: interaction => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: "Ihsen Ben Ali"})
                .setDescription(`🏓 Hi! I'm Bot, a Discord bot made by Ihsen Ben Ali#0001. I'm currently in development, so I don't have many commands yet. I'm made with [discord.js](https://discord.js.org) and [TypeScript](https://www.typescriptlang.org).`)
                .setColor(getThemeColor("text"))
            ]
        })
    },
    cooldown: 10
}

export default command