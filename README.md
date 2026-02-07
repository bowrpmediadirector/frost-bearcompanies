# BOWPR + Purple Paws Bot

A starter Discord bot tailored for **BOWPR** and **Purple Paws** with:

- Admin commands
- Ticket system
- Application system
- Music queue controls
- RP commands
- Fun commands
- Quality-of-life utilities
- Configuration controls
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
3. Fill in your bot token and IDs.
4. Run the bot:
   ```bash
   npm start
   ```
5. Run dashboard (optional):
   ```bash
   npm run dashboard
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

## Notes

- This is a production-minded scaffold: wire your preferred music backend (Lavalink/yt-dlp service), persistent storage, and permission model before public deployment.
- Dashboard uses simple secret-token auth for initial setup.
