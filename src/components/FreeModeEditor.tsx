import { useLyricsStore } from '@/store'
import { Edit3 } from 'lucide-react'

export default function FreeModeEditor() {
  const { rawLyrics, setRawLyrics } = useLyricsStore()

  return (
    <div className="panel-card rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <Edit3 className="w-3.5 h-3.5 text-ink-400" strokeWidth={1.8} />
        <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest">原创编辑</h3>
      </div>

      <textarea
        value={rawLyrics}
        onChange={(e) => setRawLyrics(e.target.value)}
        placeholder="在此自由创作歌词..."
        className="flex-1 w-full p-4 text-sm bg-paper-100 border border-paper-200 rounded-xl
          focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
          placeholder:text-ink-300 transition-all resize-none leading-relaxed lyrics-preview text-ink-700"
      />
    </div>
  )
}
