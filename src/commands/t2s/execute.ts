import {
    ChatInputCommandInteraction,
    Snowflake,
    GuildMember,
} from "discord.js";
import {
    createAudioPlayer,
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus
} from "@discordjs/voice";
import { fetchSpeechResource } from "../../api/tiktok";
import { SpeakerSubscription } from "../../SpeakerSubscription";
import { subscriptions, userVoiceSettings } from "../../state";

export default async function (interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand() || !interaction.guildId) return;

    let subscription = subscriptions.get(interaction.guildId);
    const voice = userVoiceSettings.get(interaction.user.id) || "en_us_001";

    const text = interaction.options.getString("text");
    const resource = fetchSpeechResource(voice, text);
    resource.catch(console.warn);

    await interaction.deferReply();

    if (!(interaction.member instanceof GuildMember && interaction.member.voice.channel)) {
        await interaction.followUp("Join a voice channel and then try that again!");
        return;
    }

    const channel = interaction.member.voice.channel;

    if (!subscription || (subscription.connection.joinConfig.channelId != channel.id)) {
        subscription = new SpeakerSubscription(
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }),
            createAudioPlayer()
        );
        subscription.connection.on("error", console.error);
        subscriptions.set(interaction.guildId, subscription);
    }

    try {
        await entersState(subscription.connection, VoiceConnectionStatus.Ready, 20e3);
    } catch (error) {
        console.warn(error);
        await interaction.followUp("Failed to join voice channel within 20 seconds, please try again later!");
        return;
    }

    try {
        subscription.enqueue(await resource);
        await interaction.followUp(`${interaction.member?.user} said "${text}"`);
    } catch (error) {
        console.warn(error);
        await interaction.followUp("Failed to play speech, please try again later!");
    }
}