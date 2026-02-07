import { JSONFilePreset } from 'lowdb/node';

const defaultData = {
  guilds: {},
  tickets: [],
  applications: [],
  reminders: []
};

export const db = await JSONFilePreset('data.json', defaultData);

export function guildConfig(guildId) {
  if (!db.data.guilds[guildId]) {
    db.data.guilds[guildId] = {
      prefix: '!',
      logChannelId: null,
      ticketChannelId: null,
      applicationChannelId: null
    };
  }

  return db.data.guilds[guildId];
}
