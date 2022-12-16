import { SlashCommandBuilder } from "discord.js";

export default new SlashCommandBuilder()
    .setName("t2s-voice")
    .setDescription("Set your t2s voice.")
    .addStringOption(option => option
        .setName("voice")
        .setDescription("Voice to be use.")
        .setRequired(true)
        .setAutocomplete(true)
    );