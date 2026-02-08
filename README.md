# BOWPR + Purple Paws Bot

A starter Discord bot tailored for **BOWPR** and **Purple Paws** with:

- Admin commands
- Ticket system
- Application system (Discord + dashboard entry)
- Music queue controls
- RP commands
- Fun commands
- Quality-of-life utilities
- Configuration controls
- YouTube/Twitch notifications
- Built-in CAD system
- Lightweight web dashboard

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Fill in your bot token and IDs. If the dashboard is causing startup issues on your host, set `ENABLE_DASHBOARD=false`.
4. Register slash commands:
   ```bash
   node src/deploy-commands.js
   ```
5. Run the bot:
   ```bash
   npm start
   ```

## Command categories

- `/admin ban`, `/admin kick`, `/admin purge`
- `/ticket open`, `/ticket close`
- `/application start`, `/application review`
- `/music play`, `/music skip`, `/music stop`
- `/rp hug`, `/rp pat`
- `/fun coinflip`, `/fun 8ball`
- `/qol remind`, `/qol poll`
- `/config setprefix`, `/config logchannel`
- `/notify add`, `/notify remove`, `/notify list`
- `/cad create`, `/cad status`, `/cad note`, `/cad list`

## Dashboard capabilities

- Shows live counts for tickets, applications, notifications, active CAD calls, and configured guilds.
- Adds applications directly from the dashboard.
- Adds YouTube/Twitch notification feeds.
- Creates CAD calls and returns result payloads for staff workflows.

## Notes

- Music and stream notification delivery are scaffolded with storage + management commands; connect your playback and polling/webhook workers for production delivery.
- Dashboard uses secret-token header auth (`x-dashboard-secret`) for setup and admin actions.
