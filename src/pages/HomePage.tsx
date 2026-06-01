import { useLyricsStore } from '@/store'
import { PenLine, Pencil } from 'lucide-react'
import ImageryPanel from '@/components/ImageryPanel'
import ResearchPanel from '@/components/ResearchPanel'
import FillModeEditor from '@/components/FillModeEditor'
import FreeModeEditor from '@/components/FreeModeEditor'
import LyricsPreview from '@/components/LyricsPreview'

export default function HomePage() {
  const { mode, setMode } = useLyricsStore()

  return (
    <div className="h-full flex">
      <div className="w-[340px] shrink-0 border-r border-paper-200 overflow-y-auto p-4 space-y-4 bg-white/50 flex flex-col">
        <div className="shrink-0">
          <ImageryPanel />
        </div>
        <ResearchPanel />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-2.5 border-b border-paper-200 bg-white/60 shrink-0 no-drag flex items-center gap-4">
          <div className="flex bg-paper-100 p-[3px] rounded-lg">
            <button
              onClick={() => setMode('fill')}
              className={`
                flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${mode === 'fill'
                  ? 'bg-white text-ink-800 shadow-paper'
                  : 'text-ink-300 hover:text-ink-500'
                }
              `}
            >
              <PenLine className="w-4 h-4" strokeWidth={1.8} />
              填词模式
            </button>
            <button
              onClick={() => setMode('free')}
              className={`
                flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${mode === 'free'
                  ? 'bg-white text-ink-800 shadow-paper'
                  : 'text-ink-300 hover:text-ink-500'
                }
              `}
            >
              <Pencil className="w-4 h-4" strokeWidth={1.8} />
              原创模式
            </button>
          </div>
          <div className="separator flex-1" />
          <span className="text-[10px] text-ink-300 tracking-widest uppercase">
            {mode === 'fill' ? '依曲填词' : '自由创作'}
          </span>
        </div>

        <div className="flex-1 flex min-h-0 p-4 gap-4">
          <div className="flex-1 min-w-0">
            {mode === 'fill' ? <FillModeEditor /> : <FreeModeEditor />}
          </div>
          <div className="w-[340px] shrink-0">
            <LyricsPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
