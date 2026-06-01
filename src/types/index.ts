export interface LyricLine {
  id: string
  text: string
  charLimit: number
}

export interface LyricTemplate {
  lines: LyricLine[]
  title: string
}

export type LyricMode = 'fill' | 'free'

export interface ImageryTag {
  id: string
  text: string
}

export type MoodTone =
  | '温暖'
  | '伤感'
  | '激昂'
  | '清新'
  | '深沉'
  | '浪漫'
  | '孤独'
  | '欢快'
  | '愤怒'
  | '治愈'

export interface SearchResult {
  id: string
  title: string
  snippet: string
  url: string
}

export interface LyricProject {
  id: string
  title: string
  mode: LyricMode
  imageryTags: ImageryTag[]
  moodTone: MoodTone | null
  template: LyricTemplate | null
  rawLyrics: string
  researchNotes: string
  createdAt: string
  updatedAt: string
}

export interface CommunityPost {
  id: string
  title: string
  lyrics: string
  author: string
  likes: number
  createdAt: string
}

export interface CommissionRequest {
  id: string
  title: string
  description: string
  budget: string
  status: 'open' | 'in_progress' | 'completed'
  createdAt: string
}
