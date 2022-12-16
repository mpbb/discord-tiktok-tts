import { Client, Collection, ClientOptions, Snowflake, Routes } from "discord.js";
import { SlashCommand } from "./types/SlashCommand";

export default class BotClient extends Client {
    public commands: Collection<Snowflake, SlashCommand>;
    public constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
    public async registerSlashCommands(commands: Array<SlashCommand>): Promise<unknown> {
        if (!this.application) return;
        return await this.rest.put(
            Routes.applicationCommands(this.application.id), {
            body: commands.map(command => {
                this.commands.set(command.data.name, command);
                return command.data.toJSON();
            })
        });
    }
}