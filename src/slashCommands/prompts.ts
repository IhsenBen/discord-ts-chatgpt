import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, ColorResolvable, ApplicationCommandChoicesData } from "discord.js"
import { SlashCommand } from "../types";
import { getPromptByRole, allPromptRoles } from "../functions";

const prompts: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("prompts")
        .setDescription("Feed the AI with a prompt for your specific needs.")
        .addStringOption(option => {
            return option
                .setName("prompts")
                .setDescription("Select a role among these choices for you AI: #000000")
                .setRequired(true)
                .setAutocomplete(true);
        }),
    autocomplete: async (interaction) => {
        try {
            const focusedValue = interaction.options.getFocused();
            const promptRoles = await allPromptRoles();
            console.log(promptRoles);
            const choices: string[] = [];
            if (promptRoles) {
                let filtered: { name: string, value: string }[] = [];
                for (let i = 0; i < promptRoles.length; i++) {
                    const element = promptRoles[i];
                    filtered.push({ name: element, value: element });
                }
                await interaction.respond(filtered)
            };
        } catch (error) {
            console.log(`Error: ${error.message}`)
        }
    },
    execute: async (interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });
            // get the prompt role
            const choosenRole = interaction.options.get("prompts")?.value?.toString();
            // get the prompt by role
            if (!choosenRole) return interaction.editReply({ content: "Something went wrong..." });
            const prompt = await getPromptByRole(choosenRole);
            if (!prompt) return interaction.editReply({ content: "Something went wrong..." });
            const embed = new EmbedBuilder()
                .setTitle("Here is your prompt:")
                .setDescription(prompt as string)
                .setAuthor({ name: interaction.client.user?.username || 'Default Name', iconURL: interaction.client.user?.avatarURL() || undefined })
                .setThumbnail(interaction.client.user?.avatarURL() || null)
                .setTimestamp()
            await interaction.editReply({ embeds: [embed] });
            return interaction.editReply({ content: "prompt message successfully sent." })
        } catch (error) {
            interaction.editReply({ content: "Something went wrong..." });
        }

    },
    cooldown: 10
}

export default prompts;