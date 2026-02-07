import { REST, Routes } from 'discord.js';
import { commands } from './commands/schema.js';
import { config } from './config.js';

if (!config.token || !config.clientId || !config.guildId) {
  throw new Error('Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in environment.');
}

const rest = new REST({ version: '10' }).setToken(config.token);

await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
  body: commands
});

console.log(`Registered ${commands.length} commands to guild ${config.guildId}.`);
