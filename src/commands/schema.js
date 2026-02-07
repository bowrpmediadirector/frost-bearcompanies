import { SlashCommandBuilder } from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands')
    .addSubcommand((sc) => sc.setName('ban').setDescription('Ban a member').addUserOption((o) => o.setName('user').setDescription('Target').setRequired(true)))
    .addSubcommand((sc) => sc.setName('kick').setDescription('Kick a member').addUserOption((o) => o.setName('user').setDescription('Target').setRequired(true)))
    .addSubcommand((sc) => sc.setName('purge').setDescription('Delete messages').addIntegerOption((o) => o.setName('amount').setDescription('Count').setRequired(true))),

  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket system')
    .addSubcommand((sc) => sc.setName('open').setDescription('Open a support ticket'))
    .addSubcommand((sc) => sc.setName('close').setDescription('Close current ticket')),

  new SlashCommandBuilder()
    .setName('application')
    .setDescription('Application system')
    .addSubcommand((sc) => sc.setName('start').setDescription('Start an application'))
    .addSubcommand((sc) => sc.setName('review').setDescription('Review application').addStringOption((o) => o.setName('decision').setDescription('accept or reject').setRequired(true))),

  new SlashCommandBuilder()
    .setName('music')
    .setDescription('Music controls')
    .addSubcommand((sc) => sc.setName('play').setDescription('Play from search/query').addStringOption((o) => o.setName('query').setDescription('Song URL or query').setRequired(true)))
    .addSubcommand((sc) => sc.setName('skip').setDescription('Skip current track'))
    .addSubcommand((sc) => sc.setName('stop').setDescription('Stop playback')),

  new SlashCommandBuilder()
    .setName('rp')
    .setDescription('Roleplay commands')
    .addSubcommand((sc) => sc.setName('hug').setDescription('Hug someone').addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true)))
    .addSubcommand((sc) => sc.setName('pat').setDescription('Pat someone').addUserOption((o) => o.setName('target').setDescription('Target user').setRequired(true))),

  new SlashCommandBuilder()
    .setName('fun')
    .setDescription('Fun commands')
    .addSubcommand((sc) => sc.setName('coinflip').setDescription('Flip a coin'))
    .addSubcommand((sc) => sc.setName('8ball').setDescription('Ask the magic 8 ball').addStringOption((o) => o.setName('question').setDescription('Your question').setRequired(true))),

  new SlashCommandBuilder()
    .setName('qol')
    .setDescription('Quality-of-life commands')
    .addSubcommand((sc) => sc.setName('remind').setDescription('Set a reminder').addIntegerOption((o) => o.setName('minutes').setDescription('Minutes from now').setRequired(true)).addStringOption((o) => o.setName('text').setDescription('Reminder text').setRequired(true)))
    .addSubcommand((sc) => sc.setName('poll').setDescription('Create a quick poll').addStringOption((o) => o.setName('question').setDescription('Poll question').setRequired(true))),

  new SlashCommandBuilder()
    .setName('config')
    .setDescription('Server configuration')
    .addSubcommand((sc) => sc.setName('setprefix').setDescription('Set text-command prefix').addStringOption((o) => o.setName('prefix').setDescription('Prefix').setRequired(true)))
    .addSubcommand((sc) => sc.setName('logchannel').setDescription('Set moderation log channel').addChannelOption((o) => o.setName('channel').setDescription('Log channel').setRequired(true)))
].map((c) => c.toJSON());
