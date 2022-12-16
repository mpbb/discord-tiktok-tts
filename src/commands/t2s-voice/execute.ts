import {
    ChatInputCommandInteraction,
    Snowflake,
    GuildMember,
} from "discord.js";

import { userVoiceSettings } from "../../state";

export default async function (interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;
    await interaction.deferReply();

    if (interaction.member instanceof GuildMember) {
        const voice = interaction.options.getString("voice");
        userVoiceSettings.set(interaction.user.id, voice);
        await interaction.followUp(`${interaction.member?.user} set their voice to **${voice}**`);
    }
}