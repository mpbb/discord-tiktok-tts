import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("t2s")
    .setDescription("Text-to-speech using TikTok voices.")
    .addStringOption(option => option
        .setName("text")
        .setDescription("Text to be spoken.")
        .setRequired(true)
        .setMaxLength(300)
        .setMinLength(1)
    );