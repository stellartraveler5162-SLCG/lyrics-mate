import { useState, useEffect, useCallback } from 'react'
import { Users, Heart, Trash2, Plus, X, RefreshCw, MessageCircle } from 'lucide-react'
import type { CommunityPost, PaginatedResponse } from '@/types'
import * as api from '@/services/api'

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formLyrics, setFormLyrics] = useState('')
  const [formAuthor, setFormAuthor] = useState('')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  const loadPosts = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res: PaginatedResponse<CommunityPost> = await api.fetchCommunityPosts(p, 20, 'created_at')
      setPosts(res.data)
      setTotal(res.total || 0)
      setPage(p)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPosts(1) }, [loadPosts])

  async function handleCreate() {
    if (!formTitle.trim() || !formLyrics.trim()) return
    try {
      await api.createCommunityPost({
        title: formTitle.trim(),
        lyrics: formLyrics.trim(),
        author: formAuthor.trim() || undefined,
      })
      setFormTitle('')
      setFormLyrics('')
      setFormAuthor('')
      setShowForm(false)
      loadPosts(1)
    } catch { /* ignore */ }
  }

  async function handleLike(id: string) {
    if (likedIds.has(id)) return
    try {
      const { likes } = await api.likeCommunityPost(id)
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes } : p)))
      setLikedIds((prev) => new Set(prev).add(id))
    } catch { /* ignore */ }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteCommunityPost(id)
      loadPosts(page)
    } catch { /* ignore */ }
  }

  const limit = 20
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="h-full flex flex-col bg-paper-50">
      <div className="px-6 py-4 border-b border-paper-200 bg-white/60 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-ink-500" strokeWidth={1.8} />
          <h2 className="text-sm font-semibold text-ink-700 tracking-wide">社区广场</h2>
          <span className="text-[10px] text-ink-300 bg-paper-100 px-2 py-0.5 rounded-full">
            {total} 篇作品
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadPosts(page)}
            className="p-1.5 text-ink-300 hover:text-ink-600 rounded-md hover:bg-paper-100 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-1.5 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
              transition-all flex items-center gap-1.5 text-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            发布作品
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mx-6 mt-4 panel-card rounded-xl p-5 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest">发布新作品</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 text-ink-300 hover:text-ink-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="作品标题"
            className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg mb-3
              focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300"
          />
          <textarea
            value={formLyrics}
            onChange={(e) => setFormLyrics(e.target.value)}
            placeholder="歌词内容..."
            rows={5}
            className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg mb-3
              focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300 resize-none lyrics-preview"
          />
          <input
            value={formAuthor}
            onChange={(e) => setFormAuthor(e.target.value)}
            placeholder="你的昵称（选填）"
            className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg mb-3
              focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300"
          />
          <button
            onClick={handleCreate}
            disabled={!formTitle.trim() || !formLyrics.trim()}
            className="w-full py-2 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
              disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            发布
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-ink-300">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-200">
            <Users className="w-12 h-12 mb-4 opacity-20" strokeWidth={1} />
            <p className="text-sm tracking-wide">还没有人分享作品</p>
            <p className="text-xs text-ink-200 mt-1">点击「发布作品」成为第一个</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {posts.map((post) => (
              <div
                key={post.id}
                className="panel-card rounded-xl p-5 hover:shadow-paper-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-ink-800 leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-ink-400">{post.author}</span>
                      <span className="text-[10px] text-ink-200">·</span>
                      <span className="text-[11px] text-ink-300">
                        {new Date(post.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 text-ink-200 hover:text-vermilion-500 rounded transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <pre className="text-sm text-ink-600 leading-[2.2] tracking-wide whitespace-pre-wrap lyrics-preview mb-4 font-[inherit]">
                  {post.lyrics}
                </pre>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={likedIds.has(post.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all
                      ${likedIds.has(post.id)
                        ? 'text-vermilion-500 bg-vermilion-50'
                        : 'text-ink-300 hover:text-vermilion-500 hover:bg-vermilion-50'
                      }`}
                  >
                    <Heart
                      className="w-3.5 h-3.5"
                      fill={likedIds.has(post.id) ? 'currentColor' : 'none'}
                    />
                    {post.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-paper-200 bg-white/40 shrink-0 flex items-center justify-center gap-2">
          <button
            onClick={() => loadPosts(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-xs text-ink-400 hover:text-ink-700 disabled:opacity-30 transition-all"
          >
            上一页
          </button>
          <span className="text-[10px] text-ink-300">{page} / {totalPages}</span>
          <button
            onClick={() => loadPosts(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 text-xs text-ink-400 hover:text-ink-700 disabled:opacity-30 transition-all"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
