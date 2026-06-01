import { useLyricsStore } from '@/store'
import { PenLine, Sparkles } from 'lucide-react'
import ImageryPanel from '@/components/ImageryPanel'
import ResearchPanel from '@/components/ResearchPanel'
import FillModeEditor from '@/components/FillModeEditor'
import FreeModeEditor from '@/components/FreeModeEditor'
import LyricsPreview from '@/components/LyricsPreview'

export default function HomePage() {
  const { mode, setMode } = useLyricsStore()

  return (
    <div className="h-full flex">
      <div className="w-[380px] shrink-0 border-r border-surface-200 overflow-y-auto p-5 space-y-4 bg-white/40">
        <ImageryPanel />
        <ResearchPanel />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-3 border-b border-surface-200 bg-white/60 shrink-0 no-drag">
          <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setMode('fill')}
              className={`
                flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${mode === 'fill'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-400 hover:text-surface-600'
                }
              `}
            >
              <PenLine className="w-4 h-4" />
              填词模式
            </button>
            <button
              onClick={() => setMode('free')}
              className={`
                flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${mode === 'free'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-400 hover:text-surface-600'
                }
              `}
            >
              <Sparkles className="w-4 h-4" />
              原创模式
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 p-5 gap-5">
          <div className="flex-1 min-w-0">
            {mode === 'fill' ? <FillModeEditor /> : <FreeModeEditor />}
          </div>
          <div className="w-[360px] shrink-0">
            <LyricsPreview />
          </div>
        </div>
      </div>
    </div>
  )
}
