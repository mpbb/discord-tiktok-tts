import { SlashCommand } from "SlashCommand";

import t2s from "./t2s";
import t2s_voice from "./t2s-voice";

const commands: SlashCommand[] = [
    t2s,
    t2s_voice
];

export default commands;