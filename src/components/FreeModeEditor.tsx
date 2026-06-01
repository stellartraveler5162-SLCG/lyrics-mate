import { useLyricsStore } from '@/store'
import { Edit3 } from 'lucide-react'

export default function FreeModeEditor() {
  const { rawLyrics, setRawLyrics } = useLyricsStore()

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <Edit3 className="w-4 h-4 text-primary-500" />
        <h3 className="text-sm font-semibold text-surface-700">原创编辑区</h3>
      </div>

      <textarea
        value={rawLyrics}
        onChange={(e) => setRawLyrics(e.target.value)}
        placeholder="在此自由创作歌词..."
        className="flex-1 w-full p-4 text-sm bg-surface-50 border border-surface-200 rounded-xl
          focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
          placeholder:text-surface-400 transition-all resize-none leading-relaxed lyrics-preview"
      />
    </div>
  )
}
