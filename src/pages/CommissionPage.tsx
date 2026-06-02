import { useState, useEffect, useCallback } from 'react'
import { Briefcase, Plus, X, RefreshCw, Trash2, FileText, Send } from 'lucide-react'
import type { Commission, PaginatedResponse } from '@/types'
import * as api from '@/services/api'

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  open: { label: '进行中', cls: 'text-jade-600 bg-jade-50' },
  in_progress: { label: '已承接', cls: 'text-amber-600 bg-amber-50' },
  completed: { label: '已完成', cls: 'text-ink-400 bg-ink-50' },
}

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formBudget, setFormBudget] = useState('')
  const [formAuthor, setFormAuthor] = useState('')
  const [showBid, setShowBid] = useState<string | null>(null)
  const [bidMsg, setBidMsg] = useState('')
  const [bidSample, setBidSample] = useState('')
  const [bidAuthor, setBidAuthor] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const loadCommissions = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res: PaginatedResponse<Commission> = await api.fetchCommissions(p, 20)
      setCommissions(res.data)
      setTotal(res.total || 0)
      setPage(p)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCommissions(1) }, [loadCommissions])

  async function handleCreate() {
    if (!formTitle.trim()) return
    try {
      await api.createCommission({
        title: formTitle.trim(),
        description: formDesc.trim(),
        budget: formBudget.trim(),
        author: formAuthor.trim() || undefined,
      })
      setFormTitle(''); setFormDesc(''); setFormBudget(''); setFormAuthor('')
      setShowForm(false)
      loadCommissions(1)
    } catch { /* ignore */ }
  }

  async function handleDelete(id: string) {
    try {
      await api.deleteCommission(id)
      loadCommissions(page)
    } catch { /* ignore */ }
  }

  async function handleUpdateStatus(id: string, status: string) {
    try {
      const updated = await api.updateCommission(id, { status })
      setCommissions((prev) => prev.map((c) => (c.id === id ? updated : c)))
    } catch { /* ignore */ }
  }

  async function handleBid(commissionId: string) {
    try {
      await api.createBid(commissionId, {
        message: bidMsg.trim(),
        sample: bidSample.trim(),
        author: bidAuthor.trim() || undefined,
      })
      setBidMsg(''); setBidSample(''); setBidAuthor('')
      setShowBid(null)
      const detail = await api.fetchCommission(commissionId)
      setCommissions((prev) => prev.map((c) => (c.id === commissionId ? detail : c)))
    } catch { /* ignore */ }
  }

  async function toggleExpand(id: string) {
    const next = new Set(expanded)
    if (next.has(id)) {
      next.delete(id)
    } else {
      const detail = await api.fetchCommission(id)
      setCommissions((prev) => prev.map((c) => (c.id === id ? detail : c)))
      next.add(id)
    }
    setExpanded(next)
  }

  const limit = 20
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="h-full flex flex-col bg-paper-50">
      <div className="px-6 py-4 border-b border-paper-200 bg-white/60 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-ink-500" strokeWidth={1.8} />
          <h2 className="text-sm font-semibold text-ink-700 tracking-wide">约稿中心</h2>
          <span className="text-[10px] text-ink-300 bg-paper-100 px-2 py-0.5 rounded-full">
            {total} 条需求
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadCommissions(page)}
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
            发布需求
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mx-6 mt-4 panel-card rounded-xl p-5 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest">发布约稿需求</h3>
            <button onClick={() => setShowForm(false)} className="p-1 text-ink-300 hover:text-ink-600 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="需求标题 *"
            className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg mb-3
              focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300"
          />
          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="详细描述（风格、主题、用途...）"
            rows={3}
            className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg mb-3
              focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300 resize-none"
          />
          <div className="flex gap-3 mb-3">
            <input
              value={formBudget}
              onChange={(e) => setFormBudget(e.target.value)}
              placeholder="预算（选填）"
              className="flex-1 px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
                focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300"
            />
            <input
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
              placeholder="你的昵称"
              className="flex-1 px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
                focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!formTitle.trim()}
            className="w-full py-2 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
              disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            发布需求
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full text-ink-300">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
        ) : commissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-200">
            <Briefcase className="w-12 h-12 mb-4 opacity-20" strokeWidth={1} />
            <p className="text-sm tracking-wide">暂无约稿需求</p>
            <p className="text-xs text-ink-200 mt-1">点击「发布需求」发起约稿</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {commissions.map((c) => {
              const statusInfo = STATUS_LABELS[c.status] || STATUS_LABELS.open
              const isExpanded = expanded.has(c.id)
              return (
                <div
                  key={c.id}
                  className="panel-card rounded-xl p-5 hover:shadow-paper-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                        {c.budget && (
                          <span className="text-[10px] text-ink-400 bg-paper-100 px-2 py-0.5 rounded-full">
                            {c.budget}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-ink-800 leading-snug">{c.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-ink-400">{c.author}</span>
                        <span className="text-[10px] text-ink-200">·</span>
                        <span className="text-[11px] text-ink-300">
                          {new Date(c.created_at).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {c.status === 'open' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(c.id, 'in_progress')}
                            className="px-2 py-1 text-[10px] bg-jade-50 text-jade-600 rounded-lg hover:bg-jade-100 transition-all"
                          >
                            承接
                          </button>
                          <button
                            onClick={() => setShowBid(c.id)}
                            className="px-2 py-1 text-[10px] bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-all"
                          >
                            应征
                          </button>
                        </>
                      )}
                      {c.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(c.id, 'completed')}
                          className="px-2 py-1 text-[10px] bg-jade-50 text-jade-600 rounded-lg hover:bg-jade-100 transition-all"
                        >
                          完成
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-ink-200 hover:text-vermilion-500 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {c.description && (
                    <p className="text-sm text-ink-500 leading-relaxed mb-3">{c.description}</p>
                  )}

                  {showBid === c.id && (
                    <div className="mt-3 p-4 bg-paper-100 rounded-xl border border-paper-200 animate-fade-up">
                      <textarea
                        value={bidMsg}
                        onChange={(e) => setBidMsg(e.target.value)}
                        placeholder="应征留言..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-white border border-paper-200 rounded-lg mb-2
                          focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300 resize-none"
                      />
                      <textarea
                        value={bidSample}
                        onChange={(e) => setBidSample(e.target.value)}
                        placeholder="歌词样例（选填）"
                        rows={2}
                        className="w-full px-3 py-2 text-sm bg-white border border-paper-200 rounded-lg mb-2
                          focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300 resize-none lyrics-preview"
                      />
                      <input
                        value={bidAuthor}
                        onChange={(e) => setBidAuthor(e.target.value)}
                        placeholder="你的昵称"
                        className="w-full px-3 py-2 text-sm bg-white border border-paper-200 rounded-lg mb-2
                          focus:outline-none focus:border-ink-300 text-ink-700 placeholder:text-ink-300"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBid(c.id)}
                          className="flex-1 py-2 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
                            transition-all text-sm flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          提交应征
                        </button>
                        <button
                          onClick={() => setShowBid(null)}
                          className="px-4 py-2 text-sm text-ink-400 hover:text-ink-600 transition-all"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}

                  {(c.bids?.length ?? 0) > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleExpand(c.id)}
                        className="text-[11px] text-ink-400 hover:text-ink-600 transition-all flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        {isExpanded ? '收起' : `${c.bids!.length} 条应征`}
                      </button>
                      {isExpanded && c.bids && (
                        <div className="mt-2 space-y-2">
                          {c.bids.map((bid) => (
                            <div key={bid.id} className="p-3 bg-paper-100 rounded-lg border border-paper-200">
                              <div className="flex items-center gap-2 text-[10px] text-ink-400 mb-1">
                                <span className="font-medium">{bid.author}</span>
                                <span>{new Date(bid.created_at).toLocaleDateString('zh-CN')}</span>
                              </div>
                              {bid.message && (
                                <p className="text-xs text-ink-600">{bid.message}</p>
                              )}
                              {bid.sample && (
                                <pre className="mt-1 text-xs text-ink-500 leading-relaxed lyrics-preview whitespace-pre-wrap font-[inherit]">
                                  {bid.sample}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-paper-200 bg-white/40 shrink-0 flex items-center justify-center gap-2">
          <button
            onClick={() => loadCommissions(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-xs text-ink-400 hover:text-ink-700 disabled:opacity-30 transition-all"
          >
            上一页
          </button>
          <span className="text-[10px] text-ink-300">{page} / {totalPages}</span>
          <button
            onClick={() => loadCommissions(page + 1)}
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
