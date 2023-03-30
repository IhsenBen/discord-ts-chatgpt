import {
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { config } from "dotenv";
import { color } from "../functions";
import { SlashCommand } from "../types";
config();

type Image = {
    url: string;
}

type DallEResponse = Image[];

const ImagineCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("Generate images with Dall-E 2 API")
        .addStringOption((option) =>
            option
                .setName("prompt")
                .setDescription("generates an image")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    execute: async (interaction) => {
        const prompt = interaction.options.get("prompt")?.value;
        if (!prompt) return interaction.reply({ content: "Please provide a prompt", ephemeral: true })
        async function generateImage(prompt: string) {
            const API_KEY = process.env.OPENAI_API_KEY;
            const API_URL = `https://api.openai.com/v1/images/generations`;
            try {
                if (!API_KEY) throw new Error("No API key provided");
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        size: "1024x1024",
                        n: 4,
                    }),
                });
                const json = await response.json();
                // you can use this output to get a better quality image of the generated images
                console.log(color("text", `🍃 Generated images for ${color("text", prompt)}:`))
                console.log(color("text", `🌟 ${color("links", json.data.map((image: Image, index: number) => { return "Image Number" + index + " : " + image.url }).join("\n🌟 "))}`))
                return json.data;
            } catch (error) {
                console.error(error);
            }
        }
        interaction.reply({
            content: `🤔 Let me think...`,
            ephemeral: false,
        });
        try {
            const returnedUrls: DallEResponse = await generateImage(`${prompt}`);
            if (returnedUrls.length < 4) return interaction.editReply({ content: "No images found :(" })
            let embeds: EmbedBuilder[] = [];
            returnedUrls.forEach((url: Image) => {
                const embed = new EmbedBuilder().setURL("https://openai.com/blog/dall-e/")
                    .setImage(url.url)
                    .setDescription(`Here is your generated image for **"${prompt}"**:`);
                embeds.push(embed);
            });
            interaction.editReply({
                embeds: embeds,
                content: "<:requisitos:994730420606341240>",
            });
        } catch (error_1) {
            console.error(error_1);
            interaction.editReply({
                content: " :( Oops, something went wrong.",
            });
        }
    },
};

export default ImagineCommand;
