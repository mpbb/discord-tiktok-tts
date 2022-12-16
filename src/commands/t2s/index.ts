import { SlashCommand } from "SlashCommand";
import data from "./data";
import execute from "./execute";

const command: SlashCommand = {
    data: data,
    execute: execute
};

export default command;