import { useState } from 'react'
import { useLyricsStore } from '@/store'
import { Plus, Trash2, Hash, ClipboardPaste } from 'lucide-react'

const MIN_CHAR_LIMIT = 1
const MAX_CHAR_LIMIT = 20

export default function FillModeEditor() {
  const [pasteText, setPasteText] = useState('')
  const {
    template,
    addTemplateLine,
    removeTemplateLine,
    updateLineCharLimit,
    updateLineText,
    setTemplateTitle,
    pasteLyrics,
  } = useLyricsStore()

  function handlePaste() {
    const trimmed = pasteText.trim()
    if (!trimmed) return
    pasteLyrics(trimmed)
    setPasteText('')
  }

  return (
    <div className="panel-card rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <Hash className="w-3.5 h-3.5 text-ink-400" strokeWidth={1.8} />
        <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest">填词模板</h3>
      </div>

      <div className="mb-3 shrink-0">
        <div className="flex gap-2">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData('text')
              if (pasted.trim()) {
                e.preventDefault()
                pasteLyrics(pasted.trim())
                setPasteText('')
              }
            }}
            placeholder="粘贴原歌词，自动拆分为逐行..."
            rows={3}
            className="flex-1 px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
              focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
              placeholder:text-ink-300 transition-all resize-none text-ink-600"
          />
          <button
            onClick={handlePaste}
            disabled={!pasteText.trim()}
            className="px-3 py-2 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
              disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-sm shrink-0 self-start"
          >
            <ClipboardPaste className="w-4 h-4" />
            解析
          </button>
        </div>
      </div>

      <div className="mb-3 shrink-0">
        <input
          type="text"
          value={template?.title || ''}
          onChange={(e) => setTemplateTitle(e.target.value)}
          placeholder="歌词标题"
          className="w-full px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
            focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
            placeholder:text-ink-300 transition-all text-ink-700 font-medium"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
        {template?.lines.map((line, idx) => {
          const remains = line.charLimit - line.text.length
          return (
            <div
              key={line.id}
              className="flex items-center gap-2 rounded-lg transition-all group"
            >
              <span className="text-[10px] text-ink-300 font-mono w-5 text-right shrink-0 select-none tracking-tight">
                {idx + 1}
              </span>
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => updateLineText(line.id, e.target.value)}
                  placeholder={`第 ${idx + 1} 行`}
                  className="flex-1 h-8 px-3 text-sm bg-white border border-paper-200 rounded
                    focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
                    placeholder:text-ink-200 transition-all text-ink-700"
                />
                <span
                  className={`text-[10px] font-mono shrink-0 w-8 text-right tabular-nums ${
                    remains < 0
                      ? 'text-vermilion-500'
                      : remains <= 2
                      ? 'text-amber-600'
                      : 'text-ink-300'
                  }`}
                >
                  {remains}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  value={line.charLimit}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    const clamped = isNaN(val) ? MIN_CHAR_LIMIT : Math.max(MIN_CHAR_LIMIT, Math.min(MAX_CHAR_LIMIT, val))
                    updateLineCharLimit(line.id, clamped)
                  }}
                  min={MIN_CHAR_LIMIT}
                  max={MAX_CHAR_LIMIT}
                  className="w-10 px-1 py-1 text-[10px] text-center bg-paper-100 border border-paper-200
                    rounded focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200 tabular-nums"
                  title="字数"
                />
                <button
                  onClick={() => removeTemplateLine(line.id)}
                  className="p-1 text-ink-200 hover:text-vermilion-500 transition-colors
                    opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={addTemplateLine}
        className="mt-3 w-full py-2.5 border border-dashed border-paper-300 rounded-lg
          text-ink-300 hover:text-ink-600 hover:border-ink-300 hover:bg-paper-100
          transition-all flex items-center justify-center gap-1.5 text-sm shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
        添加行 {template && `(${template.lines.length})`}
      </button>
    </div>
  )
}
