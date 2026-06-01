import { useState } from 'react'
import { useLyricsStore } from '@/store'
import { Search, Loader2, ExternalLink, BookOpen, Trash2 } from 'lucide-react'
import { webSearch } from '@/services/ai'

export default function ResearchPanel() {
  const [query, setQuery] = useState('')
  const {
    searchResults,
    setSearchResults,
    appendSearchResults,
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
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <BookOpen className="w-4 h-4 text-primary-500" />
        <h3 className="text-sm font-semibold text-surface-700">查资料区</h3>
      </div>

      <div className="flex gap-2 mb-4 shrink-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索歌词素材、典故、韵脚..."
          className="flex-1 px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg
            focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
            placeholder:text-surface-400 transition-all"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="px-3 py-2 bg-surface-700 text-white rounded-lg hover:bg-surface-800
            disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-sm shrink-0"
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
            <span className="text-xs text-surface-400 font-medium">
              共 {searchResults.length} 条结果
            </span>
            <button
              onClick={clearSearchResults}
              className="text-xs text-surface-400 hover:text-accent-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {searchResults.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-surface-50 border border-surface-100 hover:border-primary-200
                  hover:bg-primary-50/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-surface-700 leading-snug">
                    {r.title}
                  </h4>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-surface-300 hover:text-primary-500 shrink-0 mt-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-surface-500 mt-1.5 leading-relaxed">{r.snippet}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {!searchResults.length && !isSearching && (
        <div className="flex-1 flex flex-col items-center justify-center text-surface-300">
          <Search className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-xs">输入关键词，探索创作灵感</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-surface-100 shrink-0">
        <p className="text-xs text-surface-400 font-medium mb-2">备忘笔记</p>
        <textarea
          value={researchNotes}
          onChange={(e) => setResearchNotes(e.target.value)}
          placeholder="记录灵感片段、参考资料..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg
            focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
            placeholder:text-surface-400 transition-all resize-none"
        />
      </div>
    </div>
  )
}
