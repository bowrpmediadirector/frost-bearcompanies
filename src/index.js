import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from './config.js';
import { commandHandlers } from './commands/registry.js';

if (config.enableDashboard) {
  try {
    await import('./dashboard/server.js');
  } catch (error) {
    console.error('Dashboard failed to start. Set ENABLE_DASHBOARD=false to disable dashboard startup.');
    console.error(error);
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const handler = commandHandlers[interaction.commandName];
  if (!handler) {
    await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    return;
  }

  try {
    await handler(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
      return;
    }

    await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
  }
});

if (!config.token) {
  console.error('DISCORD_TOKEN is not set. Copy .env.example to .env and fill values.');
  process.exit(1);
}

await client.login(config.token);
