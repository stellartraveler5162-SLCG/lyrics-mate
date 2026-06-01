import { useState } from 'react'
import { useLyricsStore } from '@/store'
import { Plus, Trash2, Hash, ClipboardPaste } from 'lucide-react'

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
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <Hash className="w-4 h-4 text-primary-500" />
        <h3 className="text-sm font-semibold text-surface-700">填词模板</h3>
        <span className="text-[10px] text-surface-400 bg-surface-100 px-2 py-0.5 rounded-full">
          填写歌词
        </span>
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
              }
            }}
            placeholder="粘贴原歌词到这里，自动拆分为逐行..."
            rows={3}
            className="flex-1 px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg
              focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
              placeholder:text-surface-400 transition-all resize-none"
          />
          <button
            onClick={handlePaste}
            disabled={!pasteText.trim()}
            className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600
              disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 text-sm shrink-0 self-start"
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
          placeholder="歌词标题（可选）"
          className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg
            focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
            placeholder:text-surface-400 transition-all font-medium"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {template?.lines.map((line, idx) => {
          const remains = line.charLimit - line.text.length
          return (
            <div
              key={line.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-surface-50 border border-surface-100
                hover:border-primary-200 transition-all group"
            >
              <span className="text-xs text-surface-300 font-mono w-6 text-right shrink-0 select-none">
                {idx + 1}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={line.text}
                  onChange={(e) => updateLineText(line.id, e.target.value)}
                  placeholder={`第 ${idx + 1} 行（${line.charLimit}字）`}
                  className="flex-1 h-8 px-3 text-sm bg-white border border-surface-200 rounded
                    focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100
                    placeholder:text-surface-300 transition-all"
                />
                <span
                  className={`text-[10px] font-mono shrink-0 w-10 text-right ${
                    remains < 0
                      ? 'text-accent-500'
                      : remains <= 2
                      ? 'text-amber-500'
                      : 'text-surface-300'
                  }`}
                >
                  {remains}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  value={line.charLimit}
                  onChange={(e) =>
                    updateLineCharLimit(line.id, Math.max(1, Math.min(20, Number(e.target.value) || 1)))
                  }
                  min={1}
                  max={20}
                  className="w-11 px-1 py-1 text-[10px] text-center bg-white border border-surface-200
                    rounded focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100"
                  title="字数上限"
                />
                <button
                  onClick={() => removeTemplateLine(line.id)}
                  className="p-1 text-surface-300 hover:text-accent-500 transition-colors
                    opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={addTemplateLine}
        className="mt-3 w-full py-2.5 border-2 border-dashed border-surface-200 rounded-xl
          text-surface-400 hover:text-primary-500 hover:border-primary-300 hover:bg-primary-50/30
          disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 text-sm shrink-0"
      >
        <Plus className="w-4 h-4" />
        添加行 {template && `(${template.lines.length})`}
      </button>
    </div>
  )
}
