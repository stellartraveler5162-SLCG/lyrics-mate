import { useState } from 'react'
import { useLyricsStore } from '@/store'
import { X, Plus, Sun, CloudRain, Flame, Leaf, Waves, Heart, Moon, PartyPopper, Zap, Feather } from 'lucide-react'
import type { MoodTone } from '@/types'

const MOOD_TONES: { value: MoodTone; icon: typeof Sun; color: string }[] = [
  { value: '温暖', icon: Sun, color: 'text-amber-500' },
  { value: '伤感', icon: CloudRain, color: 'text-slate-400' },
  { value: '激昂', icon: Flame, color: 'text-vermilion-500' },
  { value: '清新', icon: Leaf, color: 'text-jade-500' },
  { value: '深沉', icon: Waves, color: 'text-ink-600' },
  { value: '浪漫', icon: Heart, color: 'text-vermilion-400' },
  { value: '孤独', icon: Moon, color: 'text-slate-500' },
  { value: '欢快', icon: PartyPopper, color: 'text-amber-400' },
  { value: '愤怒', icon: Zap, color: 'text-amber-600' },
  { value: '治愈', icon: Feather, color: 'text-jade-400' },
]

export default function ImageryPanel() {
  const [input, setInput] = useState('')
  const { imageryTags, addImageryTag, removeImageryTag, moodTone, setMoodTone } = useLyricsStore()

  function handleAdd() {
    const trimmed = input.trim()
    if (trimmed && !imageryTags.some((t) => t.text === trimmed)) {
      addImageryTag(trimmed)
      setInput('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="panel-card rounded-xl p-5">
      <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-widest mb-4">意象采集</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入关键词，如「月光」「枫叶」..."
          className="flex-1 px-3 py-2 text-sm bg-paper-100 border border-paper-200 rounded-lg
            focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
            placeholder:text-ink-300 transition-all text-ink-700"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-3 py-2 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
            disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      {imageryTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {imageryTags.map((tag) => (
            <span
              key={tag.id}
              className="tag-enter inline-flex items-center gap-1 px-3 py-1 bg-ink-800
                text-paper-50 rounded-full text-xs font-medium"
            >
              {tag.text}
              <button
                onClick={() => removeImageryTag(tag.id)}
                className="hover:bg-ink-700 rounded-full p-0.5 -mr-1 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <p className="text-[10px] text-ink-300 uppercase tracking-widest font-medium mb-2.5">情感基调</p>
        <div className="grid grid-cols-5 gap-1.5">
          {MOOD_TONES.map(({ value, icon: Icon, color }) => (
            <button
              key={value}
              onClick={() => setMoodTone(moodTone === value ? null : value)}
              className={`
                flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] font-medium
                transition-all duration-200
                ${moodTone === value
                  ? 'bg-ink-800 text-paper-50 shadow-ink'
                  : 'bg-paper-100 text-ink-400 hover:bg-paper-200 hover:text-ink-600'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${moodTone === value ? 'text-paper-50' : color}`} strokeWidth={1.8} />
              <span>{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
