import { useMemo, useCallback, useState } from 'react'
import { useLyricsStore } from '@/store'
import { FileDown, Copy, Check, Music4 } from 'lucide-react'

const COPY_FEEDBACK_MS = 2000

export default function LyricsPreview() {
  const { mode, template, rawLyrics, imageryTags, moodTone } = useLyricsStore()
  const [copied, setCopied] = useState(false)

  const formattedLyrics = useMemo(() => {
    if (mode === 'fill' && template) {
      return template.lines
        .map((line) => {
          const text = line.text || '＿'.repeat(line.charLimit)
          return text
        })
        .join('\n')
    }
    return rawLyrics || ''
  }, [mode, template, rawLyrics])

  const displayTitle = useMemo(() => {
    if (mode === 'fill' && template?.title) return template.title
    const firstLine = rawLyrics?.split('\n')[0]?.replace(/^#+\s*/, '')?.trim()
    return firstLine || '未命名作品'
  }, [mode, template, rawLyrics])

  const displaySubtitle = useMemo(() => {
    const tags = imageryTags.map((t) => t.text).join(' · ')
    const parts: string[] = []
    if (tags) parts.push(tags)
    if (moodTone) parts.push(moodTone)
    return parts.join('  |  ')
  }, [imageryTags, moodTone])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(formattedLyrics)
    setCopied(true)
    setTimeout(() => setCopied(false), COPY_FEEDBACK_MS)
  }, [formattedLyrics])

  const handleExport = useCallback(async () => {
    const content = `${displayTitle}\n${displaySubtitle ? `—— ${displaySubtitle}\n` : ''}\n\n${formattedLyrics}`

    if (window.electronAPI) {
      await window.electronAPI.exportFile(content, `${displayTitle}.txt`)
    } else {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${displayTitle}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }, [displayTitle, displaySubtitle, formattedLyrics])

  return (
    <div className="panel-card rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Music4 className="w-3.5 h-3.5 text-vermilion-500" strokeWidth={1.8} />
          <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest">最终歌词</h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleCopy}
            className="p-1.5 text-ink-300 hover:text-ink-700 hover:bg-paper-100
              rounded-md transition-all"
            title="复制歌词"
          >
            {copied ? <Check className="w-4 h-4 text-jade-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 text-ink-300 hover:text-ink-700 hover:bg-paper-100
              rounded-md transition-all"
            title="导出 TXT"
          >
            <FileDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-center mb-6 pt-2">
          <h2 className="text-xl font-bold text-ink-800 lyrics-preview tracking-wider">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-[11px] text-ink-300 mt-2 tracking-wide">{displaySubtitle}</p>
          )}
          <div className="separator mt-4" />
        </div>

        <div className="lyrics-preview">
          {formattedLyrics ? (
            <pre className="text-ink-600 text-sm leading-[2.6] tracking-wider whitespace-pre-wrap font-[inherit]">
              {formattedLyrics}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-ink-200">
              <Music4 className="w-10 h-10 mb-4 opacity-20" strokeWidth={1} />
              <p className="text-xs tracking-wide">
                {mode === 'fill' ? '粘贴原曲，开始填词' : '开始你的创作之旅'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
