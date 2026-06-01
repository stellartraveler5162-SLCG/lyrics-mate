import { useMemo, useCallback } from 'react'
import { useLyricsStore } from '@/store'
import { FileDown, Copy, Check, Music4 } from 'lucide-react'
import { useState } from 'react'

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
    return firstLine || '未命名歌词'
  }, [mode, template, rawLyrics])

  const displaySubtitle = useMemo(() => {
    const tags = imageryTags.map((t) => t.text).join(' · ')
    const parts: string[] = []
    if (tags) parts.push(tags)
    if (moodTone) parts.push(moodTone)
    return parts.join(' | ')
  }, [imageryTags, moodTone])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(formattedLyrics)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Music4 className="w-4 h-4 text-accent-500" />
          <h3 className="text-sm font-semibold text-surface-700">最终歌词</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-2 text-surface-400 hover:text-primary-500 hover:bg-primary-50
              rounded-lg transition-all"
            title="复制歌词"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-surface-400 hover:text-primary-500 hover:bg-primary-50
              rounded-lg transition-all"
            title="导出 TXT"
          >
            <FileDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-surface-800 lyrics-preview">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-xs text-surface-400 mt-1.5">{displaySubtitle}</p>
          )}
        </div>

        <div className="lyrics-preview">
          {formattedLyrics ? (
            <pre className="text-surface-600 text-sm leading-[2.4] tracking-wider whitespace-pre-wrap font-[inherit]">
              {formattedLyrics}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-surface-300">
              <Music4 className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm">{mode === 'fill' ? '添加模板行开始填词' : '开始你的创作之旅'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
