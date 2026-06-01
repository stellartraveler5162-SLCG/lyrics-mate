import { useState } from 'react'
import { useLyricsStore } from '@/store'
import { X, Plus, Sparkles } from 'lucide-react'
import type { MoodTone } from '@/types'

const MOOD_TONES: { value: MoodTone; emoji: string }[] = [
  { value: '温暖', emoji: '🌞' },
  { value: '伤感', emoji: '🌧️' },
  { value: '激昂', emoji: '🔥' },
  { value: '清新', emoji: '🌿' },
  { value: '深沉', emoji: '🌊' },
  { value: '浪漫', emoji: '💕' },
  { value: '孤独', emoji: '🌙' },
  { value: '欢快', emoji: '🎉' },
  { value: '愤怒', emoji: '⚡' },
  { value: '治愈', emoji: '🕊️' },
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
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary-500" />
        <h3 className="text-sm font-semibold text-surface-700">意象填写区</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入意象关键词，如「月光」「枫叶」..."
          className="flex-1 px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg
            focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100
            placeholder:text-surface-400 transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600
            disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      {imageryTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {imageryTags.map((tag) => (
            <span
              key={tag.id}
              className="tag-enter inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50
                text-primary-700 rounded-full text-sm font-medium border border-primary-100"
            >
              {tag.text}
              <button
                onClick={() => removeImageryTag(tag.id)}
                className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <p className="text-xs text-surface-400 font-medium mb-2.5">情感基调</p>
        <div className="grid grid-cols-5 gap-2">
          {MOOD_TONES.map(({ value, emoji }) => (
            <button
              key={value}
              onClick={() => setMoodTone(moodTone === value ? null : value)}
              className={`
                flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-medium
                transition-all duration-200
                ${moodTone === value
                  ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300 shadow-sm'
                  : 'bg-surface-50 text-surface-500 hover:bg-surface-100 hover:text-surface-700'
                }
              `}
            >
              <span className="text-lg">{emoji}</span>
              <span>{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
