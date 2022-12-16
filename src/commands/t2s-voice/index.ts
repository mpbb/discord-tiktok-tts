import { SlashCommand } from "SlashCommand";
import data from "./data";
import execute from "./execute";
import autocomplete from "./autocomplete";

const command: SlashCommand = {
    data: data,
    execute: execute,
    autocomplete: autocomplete
};

export default command;