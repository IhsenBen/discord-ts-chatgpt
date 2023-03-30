import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import { config } from "dotenv";
config();

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

  execute: (interaction) => {
    const prompt = interaction.options.get("prompt")?.value;
    if(!prompt) return interaction.reply({content: "Please provide a prompt", ephemeral: true})
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
            size: "512x512",
        }),
        });
        const json = await response.json();
        console.log(json.data[0].url);
        return json.data[0].url;
      } catch (error) {
        console.error(error);
      }
    }
    interaction.reply({
      content: `🤔 Let me think...`,
      ephemeral: false,
    });
    return generateImage(`${prompt}`)
      .then((url) => {
        const embed = new EmbedBuilder()
          .setImage(url)
          .setDescription(`Here is your generated image for **"${prompt}"**:`);
        interaction.editReply({
          embeds: [embed],
          content: "<:requisitos:994730420606341240>",
        });
      })
      .catch((error) => {
        console.error(error);
        interaction.editReply({
          content: " :( Oops, something went wrong.",
        });
      });
  },
};

export default ImagineCommand;
