import dotenv from 'dotenv';

dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN ?? '',
  clientId: process.env.CLIENT_ID ?? '',
  guildId: process.env.GUILD_ID ?? '',
  dashboardPort: Number(process.env.DASHBOARD_PORT ?? 3000),
  dashboardSecret: process.env.DASHBOARD_SECRET ?? 'change_me',
  enableDashboard: (process.env.ENABLE_DASHBOARD ?? 'true').toLowerCase() === 'true'
};
