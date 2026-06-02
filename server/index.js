const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const { v4: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')

const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'lyrics-mate-secret-key-2026'
const DB_PATH = path.join(__dirname, 'data.db')

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS community_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    lyrics TEXT NOT NULL,
    author TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    likes INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS commissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    budget TEXT DEFAULT '',
    author TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','completed')),
    tags TEXT DEFAULT '[]',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS commission_bids (
    id TEXT PRIMARY KEY,
    commission_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    author TEXT NOT NULL,
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

function authRequired(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '请先登录' })
  }
  try {
    const token = header.slice(7)
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: '登录已过期，请重新登录' })
  }
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ─── Auth ───

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
  if (username.length < 2 || username.length > 24) return res.status(400).json({ error: '用户名长度 2-24 位' })
  if (password.length < 4) return res.status(400).json({ error: '密码至少 4 位' })
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) return res.status(409).json({ error: '用户名已被注册' })
  const id = uuid()
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?,?,?)').run(id, username, hash)
  const token = jwt.sign({ userId: id, username }, JWT_SECRET, { expiresIn: '30d' })
  res.status(201).json({ token, user: { id, username } })
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' })
  res.json({ token, user: { id: user.id, username: user.username } })
})

app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ user: { id: req.user.userId, username: req.user.username } })
})

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

app.post('/api/community', authRequired, (req, res) => {
  const { title, lyrics, tags } = req.body
  if (!title || !lyrics) return res.status(400).json({ error: 'title and lyrics required' })
  const id = uuid()
  const now = new Date().toISOString()
  const author = req.user.username
  const post = { id, user_id: req.user.userId, title, lyrics, author, tags: JSON.stringify(tags || []), likes: 0, created_at: now, updated_at: now }
  db.prepare('INSERT INTO community_posts (id, user_id, title, lyrics, author, tags, likes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)').run(
    post.id, post.user_id, post.title, post.lyrics, post.author, post.tags, post.likes, post.created_at, post.updated_at
  )
  res.status(201).json(post)
})

app.delete('/api/community/:id', authRequired, (req, res) => {
  const post = db.prepare('SELECT user_id FROM community_posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ error: 'Not found' })
  if (post.user_id !== req.user.userId) return res.status(403).json({ error: '只能删除自己的作品' })
  db.prepare('DELETE FROM community_posts WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.post('/api/community/:id/like', authRequired, (req, res) => {
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

app.post('/api/commissions', authRequired, (req, res) => {
  const { title, description, budget, tags } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const id = uuid()
  const now = new Date().toISOString()
  const author = req.user.username
  const commission = { id, user_id: req.user.userId, title, description: description || '', budget: budget || '', author, status: 'open', tags: JSON.stringify(tags || []), created_at: now, updated_at: now }
  db.prepare('INSERT INTO commissions (id, user_id, title, description, budget, author, status, tags, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)').run(
    commission.id, commission.user_id, commission.title, commission.description, commission.budget, commission.author, commission.status, commission.tags, commission.created_at, commission.updated_at
  )
  res.status(201).json({ ...commission, bids: [] })
})

app.patch('/api/commissions/:id', authRequired, (req, res) => {
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

app.delete('/api/commissions/:id', authRequired, (req, res) => {
  const commission = db.prepare('SELECT user_id FROM commissions WHERE id = ?').get(req.params.id)
  if (!commission) return res.status(404).json({ error: 'Not found' })
  if (commission.user_id !== req.user.userId) return res.status(403).json({ error: '只能删除自己的需求' })
  db.prepare('DELETE FROM commissions WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.post('/api/commissions/:id/bids', authRequired, (req, res) => {
  const commission = db.prepare('SELECT id, status FROM commissions WHERE id = ?').get(req.params.id)
  if (!commission) return res.status(404).json({ error: 'Commission not found' })
  if (commission.status !== 'open') return res.status(400).json({ error: 'Commission is not open for bids' })
  const { message, sample } = req.body
  const id = uuid()
  const now = new Date().toISOString()
  const author = req.user.username
  const bid = { id, commission_id: req.params.id, user_id: req.user.userId, author, message: message || '', sample: sample || '', created_at: now }
  db.prepare('INSERT INTO commission_bids (id, commission_id, user_id, author, message, sample, created_at) VALUES (?,?,?,?,?,?,?)').run(
    bid.id, bid.commission_id, bid.user_id, bid.author, bid.message, bid.sample, bid.created_at
  )
  res.status(201).json(bid)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lyrics Mate API running on port ${PORT}`)
})
