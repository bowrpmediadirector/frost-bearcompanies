import { db, guildConfig } from '../storage.js';

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const commandHandlers = {
  async admin(interaction) {
    const action = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');

    if (action === 'purge') {
      const amount = interaction.options.getInteger('amount');
      await interaction.reply({ content: `🧹 Purge queued for ${amount} messages (implement bulk delete logic).`, ephemeral: true });
      return;
    }

    await interaction.reply({ content: `✅ ${action.toUpperCase()} requested for ${user?.tag ?? 'target'}.`, ephemeral: true });
  },

  async ticket(interaction) {
    const action = interaction.options.getSubcommand();

    if (action === 'open') {
      db.data.tickets.push({
        id: `T-${Date.now()}`,
        guildId: interaction.guildId,
        userId: interaction.user.id,
        createdAt: new Date().toISOString(),
        status: 'open'
      });
      await db.write();
      await interaction.reply({ content: '🎫 Ticket created. Staff will be with you shortly.', ephemeral: true });
      return;
    }

    await interaction.reply({ content: '🔒 Ticket closed.', ephemeral: true });
  },

  async application(interaction) {
    const action = interaction.options.getSubcommand();

    if (action === 'start') {
      db.data.applications.push({
        id: `A-${Date.now()}`,
        guildId: interaction.guildId,
        userId: interaction.user.id,
        answers: [],
        status: 'pending'
      });
      await db.write();
      await interaction.reply({ content: '📝 Application started. Check your DMs for questions (hook up modal/DM flow).', ephemeral: true });
      return;
    }

    const decision = interaction.options.getString('decision');
    await interaction.reply({ content: `📋 Application marked as **${decision}**.`, ephemeral: true });
  },

  async music(interaction) {
    const action = interaction.options.getSubcommand();

    if (action === 'play') {
      const query = interaction.options.getString('query');
      await interaction.reply(`🎵 Added to queue: **${query}** (connect Lavalink/player backend).`);
      return;
    }

    await interaction.reply(`🎶 Music action: **${action}**.`);
  },

  async rp(interaction) {
    const action = interaction.options.getSubcommand();
    const target = interaction.options.getUser('target');
    const emoji = action === 'hug' ? '🤗' : '🐾';
    await interaction.reply(`${emoji} ${interaction.user} ${action}s ${target}!`);
  },

  async fun(interaction) {
    const action = interaction.options.getSubcommand();

    if (action === 'coinflip') {
      await interaction.reply(`🪙 ${random(['Heads', 'Tails'])}`);
      return;
    }

    const prompt = interaction.options.getString('question');
    await interaction.reply(`🎱 Q: ${prompt}\nA: ${random(['Yes.', 'No.', 'Maybe.', 'Ask again later.'])}`);
  },

  async qol(interaction) {
    const action = interaction.options.getSubcommand();

    if (action === 'remind') {
      const minutes = interaction.options.getInteger('minutes');
      const text = interaction.options.getString('text');
      db.data.reminders.push({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        dueAt: Date.now() + minutes * 60_000,
        text
      });
      await db.write();
      await interaction.reply({ content: `⏰ Reminder set for ${minutes} minutes.`, ephemeral: true });
      return;
    }

    const question = interaction.options.getString('question');
    await interaction.reply(`📊 Poll started: **${question}**\nReact with 👍 / 👎`);
  },

  async config(interaction) {
    const action = interaction.options.getSubcommand();
    const settings = guildConfig(interaction.guildId);

    if (action === 'setprefix') {
      settings.prefix = interaction.options.getString('prefix');
    }

    if (action === 'logchannel') {
      settings.logChannelId = interaction.options.getChannel('channel')?.id ?? null;
    }

    await db.write();
    await interaction.reply({ content: '⚙️ Server configuration updated.', ephemeral: true });
  }
};
