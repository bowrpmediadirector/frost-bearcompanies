import { db, guildConfig } from '../storage.js';

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}`;
}

async function requireGuild(interaction) {
  if (interaction.guildId) return true;
  await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  return false;
}

export const commandHandlers = {
  async admin(interaction) {
    if (!(await requireGuild(interaction))) return;

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
    if (!(await requireGuild(interaction))) return;
    const action = interaction.options.getSubcommand();

    if (action === 'open') {
      db.data.tickets.push({
        id: newId('T'),
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
    if (!(await requireGuild(interaction))) return;
    const action = interaction.options.getSubcommand();

    if (action === 'start') {
      db.data.applications.push({
        id: newId('A'),
        guildId: interaction.guildId,
        userId: interaction.user.id,
        applicantTag: interaction.user.tag,
        answers: [],
        status: 'pending',
        source: 'discord',
        createdAt: new Date().toISOString()
      });
      await db.write();
      await interaction.reply({ content: '📝 Application started. Check your DMs for questions (hook up modal/DM flow).', ephemeral: true });
      return;
    }

    const decision = interaction.options.getString('decision');
    await interaction.reply({ content: `📋 Application marked as **${decision}**.`, ephemeral: true });
  },

  async music(interaction) {
    if (!(await requireGuild(interaction))) return;
    const action = interaction.options.getSubcommand();

    if (action === 'play') {
      const query = interaction.options.getString('query');
      await interaction.reply(`🎵 Added to queue: **${query}** (connect Lavalink/player backend).`);
      return;
    }

    await interaction.reply(`🎶 Music action: **${action}**.`);
  },

  async rp(interaction) {
    if (!(await requireGuild(interaction))) return;
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
    if (!(await requireGuild(interaction))) return;
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
    if (!(await requireGuild(interaction))) return;
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
  },

  async notify(interaction) {
    if (!(await requireGuild(interaction))) return;
    const action = interaction.options.getSubcommand();

    if (action === 'list') {
      const feeds = db.data.notifications.filter((n) => n.guildId === interaction.guildId);
      if (!feeds.length) {
        await interaction.reply({ content: '📡 No YouTube/Twitch feeds configured yet.', ephemeral: true });
        return;
      }

      const lines = feeds.map((n) => `• [${n.platform}] ${n.source} -> <#${n.discordChannelId}>`);
      await interaction.reply({ content: `📡 Configured feeds:\n${lines.join('\n')}`, ephemeral: true });
      return;
    }

    const platform = interaction.options.getString('platform');
    const source = interaction.options.getString('source').trim().toLowerCase();

    if (action === 'add') {
      const discordChannelId = interaction.options.getChannel('channel')?.id;
      const exists = db.data.notifications.some((n) =>
        n.guildId === interaction.guildId && n.platform === platform && n.source === source && n.discordChannelId === discordChannelId
      );

      if (exists) {
        await interaction.reply({ content: 'ℹ️ That notification feed already exists.', ephemeral: true });
        return;
      }

      db.data.notifications.push({
        id: newId('N'),
        guildId: interaction.guildId,
        platform,
        source,
        discordChannelId,
        enabled: true,
        createdBy: interaction.user.id,
        createdAt: new Date().toISOString()
      });
      await db.write();
      await interaction.reply({ content: `✅ Added ${platform} feed \`${source}\` to <#${discordChannelId}>.`, ephemeral: true });
      return;
    }

    const before = db.data.notifications.length;
    db.data.notifications = db.data.notifications.filter((n) => !(n.guildId === interaction.guildId && n.platform === platform && n.source === source));
    await db.write();
    const removed = before - db.data.notifications.length;
    await interaction.reply({ content: removed ? `🗑️ Removed ${removed} feed(s).` : 'No matching feed found.', ephemeral: true });
  },

  async cad(interaction) {
    if (!(await requireGuild(interaction))) return;
    const action = interaction.options.getSubcommand();

    if (action === 'create') {
      const call = {
        id: newId('CAD'),
        guildId: interaction.guildId,
        title: interaction.options.getString('title'),
        location: interaction.options.getString('location'),
        priority: interaction.options.getString('priority'),
        status: 'new',
        notes: [],
        createdAt: new Date().toISOString(),
        createdBy: interaction.user.id
      };
      db.data.cadCalls.push(call);
      await db.write();
      await interaction.reply(`🚓 CAD call created: **${call.id}** | ${call.title} @ ${call.location} [${call.priority}]`);
      return;
    }

    if (action === 'list') {
      const active = db.data.cadCalls.filter((c) => c.guildId === interaction.guildId && c.status !== 'closed');
      if (!active.length) {
        await interaction.reply({ content: '🗂️ No active CAD calls.', ephemeral: true });
        return;
      }

      const lines = active.slice(0, 10).map((c) => `• ${c.id} | ${c.title} | ${c.status} | ${c.location}`);
      await interaction.reply({ content: `🗂️ Active CAD calls:\n${lines.join('\n')}`, ephemeral: true });
      return;
    }

    const id = interaction.options.getString('id');
    const call = db.data.cadCalls.find((c) => c.id === id && c.guildId === interaction.guildId);

    if (!call) {
      await interaction.reply({ content: '❌ CAD call not found.', ephemeral: true });
      return;
    }

    if (action === 'status') {
      call.status = interaction.options.getString('status');
      call.updatedAt = new Date().toISOString();
      await db.write();
      await interaction.reply({ content: `✅ ${id} updated to status **${call.status}**.` });
      return;
    }

    const note = interaction.options.getString('note');
    call.notes.push({ by: interaction.user.id, text: note, at: new Date().toISOString() });
    call.updatedAt = new Date().toISOString();
    await db.write();
    await interaction.reply({ content: `📝 Note added to ${id}.`, ephemeral: true });
  }
};
