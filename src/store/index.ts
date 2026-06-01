import { create } from 'zustand'
import type { LyricMode, ImageryTag, MoodTone, LyricTemplate, LyricLine, SearchResult } from '@/types'

interface LyricsStore {
  mode: LyricMode
  setMode: (mode: LyricMode) => void

  imageryTags: ImageryTag[]
  addImageryTag: (tag: string) => void
  removeImageryTag: (id: string) => void

  moodTone: MoodTone | null
  setMoodTone: (tone: MoodTone | null) => void

  template: LyricTemplate | null
  addTemplateLine: () => void
  removeTemplateLine: (id: string) => void
  updateLineCharLimit: (id: string, limit: number) => void
  updateLineText: (id: string, text: string) => void
  setTemplateTitle: (title: string) => void
  pasteLyrics: (text: string) => void

  rawLyrics: string
  setRawLyrics: (lyrics: string) => void

  researchNotes: string
  setResearchNotes: (notes: string) => void

  searchResults: SearchResult[]
  setSearchResults: (results: SearchResult[]) => void
  appendSearchResults: (results: SearchResult[]) => void
  clearSearchResults: () => void
  isSearching: boolean
  setIsSearching: (loading: boolean) => void
}

let lineCounter = 0

function makeLineId() {
  return `line-${++lineCounter}-${Date.now()}`
}

export const useLyricsStore = create<LyricsStore>((set) => ({
  mode: 'fill',
  setMode: (mode) => set({ mode }),

  imageryTags: [],
  addImageryTag: (tag) =>
    set((s) => ({
      imageryTags: [
        ...s.imageryTags,
        { id: `tag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text: tag },
      ],
    })),
  removeImageryTag: (id) =>
    set((s) => ({ imageryTags: s.imageryTags.filter((t) => t.id !== id) })),

  moodTone: null,
  setMoodTone: (tone) => set({ moodTone: tone }),

  template: null,
  addTemplateLine: () =>
    set((s) => {
      const line: LyricLine = { id: makeLineId(), text: '', charLimit: 7 }
      return {
        template: s.template
          ? { ...s.template, lines: [...s.template.lines, line] }
          : { title: '', lines: [line] },
      }
    }),
  removeTemplateLine: (id) =>
    set((s) => ({
      template: s.template
        ? { ...s.template, lines: s.template.lines.filter((l) => l.id !== id) }
        : null,
    })),
  updateLineCharLimit: (id, limit) =>
    set((s) => ({
      template: s.template
        ? {
            ...s.template,
            lines: s.template.lines.map((l) =>
              l.id === id ? { ...l, charLimit: limit } : l
            ),
          }
        : null,
    })),
  updateLineText: (id, text) =>
    set((s) => ({
      template: s.template
        ? {
            ...s.template,
            lines: s.template.lines.map((l) =>
              l.id === id ? { ...l, text } : l
            ),
          }
        : null,
    })),
  setTemplateTitle: (title) =>
    set((s) => ({
      template: s.template ? { ...s.template, title } : { title, lines: [] },
    })),
  pasteLyrics: (text) =>
    set((s) => {
      const rawLines = text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
      const lines: LyricLine[] = rawLines.map((t) => ({
        id: makeLineId(),
        text: t,
        charLimit: Math.min(20, Math.max(1, t.length)),
      }))
      return {
        template: s.template
          ? { ...s.template, lines }
          : { title: '', lines },
      }
    }),

  rawLyrics: '',
  setRawLyrics: (lyrics) => set({ rawLyrics: lyrics }),

  researchNotes: '',
  setResearchNotes: (notes) => set({ researchNotes: notes }),

  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  appendSearchResults: (results) =>
    set((s) => ({ searchResults: [...s.searchResults, ...results] })),
  clearSearchResults: () => set({ searchResults: [] }),
  isSearching: false,
  setIsSearching: (loading) => set({ isSearching: loading }),
}))
