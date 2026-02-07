import express from 'express';
import { config } from '../config.js';
import { db, guildConfig } from '../storage.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

function dashboardAuth(req, res, next) {
  const auth = req.headers['x-dashboard-secret'];
  if (auth !== config.dashboardSecret) {
    return res.status(403).json({ ok: false, message: 'Invalid dashboard secret.' });
  }

  return next();
}

app.get('/api/stats', (req, res) => {
  const activeCadCalls = db.data.cadCalls.filter((c) => c.status !== 'closed').length;

  res.json({
    tickets: db.data.tickets.length,
    applications: db.data.applications.length,
    reminders: db.data.reminders.length,
    notifications: db.data.notifications.length,
    cadCalls: activeCadCalls,
    guilds: Object.keys(db.data.guilds).length
  });
});

app.get('/api/applications', (req, res) => {
  const applications = [...db.data.applications].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  res.json({ ok: true, applications });
});

app.post('/api/applications/:guildId', dashboardAuth, async (req, res) => {
  const { guildId } = req.params;
  const { applicantTag, userId, notes = [], status = 'pending' } = req.body;

  if (!applicantTag) {
    return res.status(400).json({ ok: false, message: 'applicantTag is required.' });
  }

  const item = {
    id: `A-${Date.now().toString(36)}`,
    guildId,
    userId: userId ?? 'dashboard',
    applicantTag,
    answers: notes,
    status,
    source: 'dashboard',
    createdAt: new Date().toISOString()
  };

  db.data.applications.push(item);
  await db.write();
  return res.json({ ok: true, application: item });
});

app.get('/api/notifications/:guildId', (req, res) => {
  const { guildId } = req.params;
  const notifications = db.data.notifications.filter((n) => n.guildId === guildId);
  res.json({ ok: true, notifications });
});

app.post('/api/notifications/:guildId', dashboardAuth, async (req, res) => {
  const { guildId } = req.params;
  const { platform, source, discordChannelId } = req.body;

  if (!platform || !source || !discordChannelId) {
    return res.status(400).json({ ok: false, message: 'platform, source, and discordChannelId are required.' });
  }

  const entry = {
    id: `N-${Date.now().toString(36)}`,
    guildId,
    platform,
    source: String(source).toLowerCase(),
    discordChannelId,
    enabled: true,
    createdAt: new Date().toISOString(),
    createdBy: 'dashboard'
  };

  db.data.notifications.push(entry);
  const settings = guildConfig(guildId);
  settings.notificationChannelId = discordChannelId;
  await db.write();

  return res.json({ ok: true, notification: entry });
});

app.get('/api/cad/:guildId', (req, res) => {
  const { guildId } = req.params;
  const calls = db.data.cadCalls.filter((c) => c.guildId === guildId).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  res.json({ ok: true, calls });
});

app.post('/api/cad/:guildId', dashboardAuth, async (req, res) => {
  const { guildId } = req.params;
  const { title, location, priority = 'medium' } = req.body;

  if (!title || !location) {
    return res.status(400).json({ ok: false, message: 'title and location are required.' });
  }

  const call = {
    id: `CAD-${Date.now().toString(36)}`,
    guildId,
    title,
    location,
    priority,
    status: 'new',
    notes: [],
    source: 'dashboard',
    createdAt: new Date().toISOString()
  };

  db.data.cadCalls.push(call);
  await db.write();
  return res.json({ ok: true, call });
});

app.patch('/api/cad/:guildId/:callId', dashboardAuth, async (req, res) => {
  const { guildId, callId } = req.params;
  const { status, note } = req.body;
  const call = db.data.cadCalls.find((c) => c.guildId === guildId && c.id === callId);

  if (!call) {
    return res.status(404).json({ ok: false, message: 'Call not found.' });
  }

  if (status) {
    call.status = status;
  }

  if (note) {
    call.notes.push({ by: 'dashboard', text: note, at: new Date().toISOString() });
  }

  call.updatedAt = new Date().toISOString();
  await db.write();
  return res.json({ ok: true, call });
});

app.post('/api/config/:guildId', dashboardAuth, async (req, res) => {
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
