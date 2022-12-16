import { Snowflake } from "discord.js";
import { SpeakerSubscription } from "../SpeakerSubscription";

export const subscriptions = new Map<Snowflake, SpeakerSubscription>();
export const userVoiceSettings = new Map<Snowflake, string>();