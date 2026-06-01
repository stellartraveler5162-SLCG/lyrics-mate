import { useState } from 'react'
import { useLyricsStore } from '@/store'
import { Search, Loader2, ExternalLink, BookOpen, Trash2 } from 'lucide-react'
import { webSearch } from '@/services/ai'

export default function ResearchPanel() {
  const [query, setQuery] = useState('')
  const {
    searchResults,
    setSearchResults,
    clearSearchResults,
    isSearching,
    setIsSearching,
    researchNotes,
    setResearchNotes,
  } = useLyricsStore()

  async function handleSearch() {
    const q = query.trim()
    if (!q) return
    setIsSearching(true)
    try {
      const results = await webSearch(q)
      setSearchResults(results)
    } finally {
      setIsSearching(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="panel-card rounded-xl p-5 flex flex-col min-h-0 flex-1">
      <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4 shrink-0">查阅资料</h3>

      <div className="flex gap-2 mb-4 shrink-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索素材、典故、韵脚..."
          className="flex-1 px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
            focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
            placeholder:text-ink-300 transition-all text-ink-700"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="px-3 py-2 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
            disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-sm shrink-0"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          搜索
        </button>
      </div>

      {searchResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="text-[10px] text-ink-300 font-medium uppercase tracking-wider">
              {searchResults.length} 条结果
            </span>
            <button
              onClick={clearSearchResults}
              className="text-[10px] text-ink-300 hover:text-vermilion-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {searchResults.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg bg-paper-100 border border-paper-200 hover:border-ink-200
                  hover:bg-paper-50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-ink-700 leading-snug">
                    {r.title}
                  </h4>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-300 hover:text-ink-600 shrink-0 mt-0.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-ink-400 mt-1.5 leading-relaxed">{r.snippet}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!searchResults.length && !isSearching && (
        <div className="flex-1 flex flex-col items-center justify-center text-ink-200">
          <BookOpen className="w-8 h-8 mb-3 opacity-30" strokeWidth={1} />
          <p className="text-[11px] tracking-wide">输入关键词，探索创作灵感</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-paper-200 shrink-0">
        <p className="text-[10px] text-ink-300 uppercase tracking-widest font-medium mb-2">备忘笔记</p>
        <textarea
          value={researchNotes}
          onChange={(e) => setResearchNotes(e.target.value)}
          placeholder="记录灵感片段、参考资料..."
          rows={2}
          className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
            focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
            placeholder:text-ink-300 transition-all resize-none text-ink-600"
        />
      </div>
    </div>
  )
}
