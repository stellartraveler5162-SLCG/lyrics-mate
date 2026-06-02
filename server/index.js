const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const { v4: uuid } = require('uuid')
const path = require('path')

const PORT = process.env.PORT || 3001
const DB_PATH = path.join(__dirname, 'data.db')

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS community_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    lyrics TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT '匿名',
    tags TEXT DEFAULT '[]',
    likes INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS commissions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    budget TEXT DEFAULT '',
    author TEXT NOT NULL DEFAULT '匿名',
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','completed')),
    tags TEXT DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS commission_bids (
    id TEXT PRIMARY KEY,
    commission_id TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT '匿名',
    message TEXT NOT NULL DEFAULT '',
    sample TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (commission_id) REFERENCES commissions(id) ON DELETE CASCADE
  );
`)

function paginate(req) {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

function jsonList(rows, { page, limit }) {
  return { data: rows, page, limit }
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ─── Community Posts ───

app.get('/api/community', (req, res) => {
  const { page, limit, offset } = paginate(req)
  const sort = req.query.sort === 'likes' ? 'likes' : 'created_at'
  const total = db.prepare('SELECT COUNT(*) as count FROM community_posts').get().count
  const rows = db.prepare(
    `SELECT * FROM community_posts ORDER BY ${sort === 'likes' ? 'likes DESC, ' : ''}created_at DESC LIMIT ? OFFSET ?`
  ).all(limit, offset)
  res.json({ ...jsonList(rows, { page, limit }), total })
})

app.get('/api/community/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ error: 'Not found' })
  res.json(post)
})

app.post('/api/community', (req, res) => {
  const { title, lyrics, author, tags } = req.body
  if (!title || !lyrics) return res.status(400).json({ error: 'title and lyrics required' })
  const id = uuid()
  const now = new Date().toISOString()
  const post = { id, title, lyrics, author: author || '匿名', tags: JSON.stringify(tags || []), likes: 0, created_at: now, updated_at: now }
  db.prepare('INSERT INTO community_posts (id, title, lyrics, author, tags, likes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)').run(
    post.id, post.title, post.lyrics, post.author, post.tags, post.likes, post.created_at, post.updated_at
  )
  res.status(201).json(post)
})

app.delete('/api/community/:id', (req, res) => {
  const result = db.prepare('DELETE FROM community_posts WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

app.post('/api/community/:id/like', (req, res) => {
  const post = db.prepare('SELECT id, likes FROM community_posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ error: 'Not found' })
  const newLikes = post.likes + 1
  db.prepare('UPDATE community_posts SET likes = ?, updated_at = datetime(\'now\') WHERE id = ?').run(newLikes, post.id)
  res.json({ likes: newLikes })
})

// ─── Commissions ───

app.get('/api/commissions', (req, res) => {
  const { page, limit, offset } = paginate(req)
  const status = req.query.status
  let query = 'SELECT * FROM commissions'
  let countQuery = 'SELECT COUNT(*) as count FROM commissions'
  const params = []
  if (status && ['open', 'in_progress', 'completed'].includes(status)) {
    query += ' WHERE status = ?'
    countQuery += ' WHERE status = ?'
    params.push(status)
  }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  const total = db.prepare(countQuery).get(...params).count
  const rows = db.prepare(query).all(...params, limit, offset)
  res.json({ ...jsonList(rows, { page, limit }), total })
})

app.get('/api/commissions/:id', (req, res) => {
  const commission = db.prepare('SELECT * FROM commissions WHERE id = ?').get(req.params.id)
  if (!commission) return res.status(404).json({ error: 'Not found' })
  const bids = db.prepare('SELECT * FROM commission_bids WHERE commission_id = ? ORDER BY created_at DESC').all(req.params.id)
  res.json({ ...commission, bids })
})

app.post('/api/commissions', (req, res) => {
  const { title, description, budget, author, tags } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const id = uuid()
  const now = new Date().toISOString()
  const commission = { id, title, description: description || '', budget: budget || '', author: author || '匿名', status: 'open', tags: JSON.stringify(tags || []), created_at: now, updated_at: now }
  db.prepare('INSERT INTO commissions (id, title, description, budget, author, status, tags, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)').run(
    commission.id, commission.title, commission.description, commission.budget, commission.author, commission.status, commission.tags, commission.created_at, commission.updated_at
  )
  res.status(201).json({ ...commission, bids: [] })
})

app.patch('/api/commissions/:id', (req, res) => {
  const commission = db.prepare('SELECT * FROM commissions WHERE id = ?').get(req.params.id)
  if (!commission) return res.status(404).json({ error: 'Not found' })
  const { status, title, description, budget } = req.body
  if (status && ['open', 'in_progress', 'completed'].includes(status)) {
    db.prepare('UPDATE commissions SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, req.params.id)
  }
  if (title || description !== undefined || budget !== undefined) {
    const updates = []
    const values = []
    if (title) { updates.push('title = ?'); values.push(title) }
    if (description !== undefined) { updates.push('description = ?'); values.push(description) }
    if (budget !== undefined) { updates.push('budget = ?'); values.push(budget) }
    if (updates.length) {
      updates.push('updated_at = datetime(\'now\')')
      db.prepare(`UPDATE commissions SET ${updates.join(', ')} WHERE id = ?`).run(...values, req.params.id)
    }
  }
  const updated = db.prepare('SELECT * FROM commissions WHERE id = ?').get(req.params.id)
  const bids = db.prepare('SELECT * FROM commission_bids WHERE commission_id = ? ORDER BY created_at DESC').all(req.params.id)
  res.json({ ...updated, bids })
})

app.delete('/api/commissions/:id', (req, res) => {
  const result = db.prepare('DELETE FROM commissions WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

// ─── Commission Bids ───

app.get('/api/commissions/:id/bids', (req, res) => {
  const commission = db.prepare('SELECT id FROM commissions WHERE id = ?').get(req.params.id)
  if (!commission) return res.status(404).json({ error: 'Commission not found' })
  const bids = db.prepare('SELECT * FROM commission_bids WHERE commission_id = ? ORDER BY created_at DESC').all(req.params.id)
  res.json({ data: bids })
})

app.post('/api/commissions/:id/bids', (req, res) => {
  const commission = db.prepare('SELECT id, status FROM commissions WHERE id = ?').get(req.params.id)
  if (!commission) return res.status(404).json({ error: 'Commission not found' })
  if (commission.status !== 'open') return res.status(400).json({ error: 'Commission is not open for bids' })
  const { author, message, sample } = req.body
  const id = uuid()
  const now = new Date().toISOString()
  const bid = { id, commission_id: req.params.id, author: author || '匿名', message: message || '', sample: sample || '', created_at: now }
  db.prepare('INSERT INTO commission_bids (id, commission_id, author, message, sample, created_at) VALUES (?,?,?,?,?,?)').run(
    bid.id, bid.commission_id, bid.author, bid.message, bid.sample, bid.created_at
  )
  res.status(201).json(bid)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lyrics Mate API running on port ${PORT}`)
})
