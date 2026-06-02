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
  | '温暖' | '伤感' | '激昂' | '清新' | '深沉'
  | '浪漫' | '孤独' | '欢快' | '愤怒' | '治愈'

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
  tags: string
  likes: number
  created_at: string
  updated_at: string
}

export interface Commission {
  id: string
  title: string
  description: string
  budget: string
  author: string
  tags: string
  status: 'open' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
  bids?: CommissionBid[]
}

export interface CommissionBid {
  id: string
  commission_id: string
  author: string
  message: string
  sample: string
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total?: number
}
