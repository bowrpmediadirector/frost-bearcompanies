import express from 'express';
import { config } from '../config.js';
import { db } from '../storage.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/api/stats', (req, res) => {
  res.json({
    tickets: db.data.tickets.length,
    applications: db.data.applications.length,
    reminders: db.data.reminders.length,
    guilds: Object.keys(db.data.guilds).length
  });
});

app.post('/api/config/:guildId', async (req, res) => {
  const auth = req.headers['x-dashboard-secret'];
  if (auth !== config.dashboardSecret) {
    return res.status(403).json({ ok: false, message: 'Invalid dashboard secret.' });
  }

  const { guildId } = req.params;
  db.data.guilds[guildId] = {
    ...(db.data.guilds[guildId] ?? {}),
    ...req.body
  };
  await db.write();

  return res.json({ ok: true, guildId, config: db.data.guilds[guildId] });
});

app.listen(config.dashboardPort, () => {
  console.log(`Dashboard running on http://localhost:${config.dashboardPort}`);
});
