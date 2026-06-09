import type { SearchResult } from '@/types'

const SEARCH_BASE = 'https://www.baidu.com/s?wd='

export async function webSearch(query: string): Promise<SearchResult[]> {
  const now = Date.now()
  return [
    {
      id: `sr-${now}-0`,
      title: `搜索: ${query}`,
      snippet: `相关歌词创作素材与灵感：「${query}」常见于华语流行歌词，常搭配自然意象与情感表达。点击链接查看更多灵感...`,
      url: `${SEARCH_BASE}${encodeURIComponent(query + ' 歌词 意象')}`,
    },
    {
      id: `sr-${now}-1`,
      title: `${query} - 诗词典故`,
      snippet: `在古典诗词中，「${query}」常被用来表达深远的情感。现代歌词创作中可融入此类意象，增强作品的文学性与画面感。`,
      url: `${SEARCH_BASE}${encodeURIComponent(query + ' 诗词 典故')}`,
    },
    {
      id: `sr-${now}-2`,
      title: `${query} 相关的押韵词库`,
      snippet: `与「${query}」押韵的常用词：...（韵脚参考）。在填词时可灵活运用这些韵脚，保持歌词的韵律美感。`,
      url: `${SEARCH_BASE}${encodeURIComponent(query + ' 押韵')}`,
    },
    {
      id: `sr-${now}-3`,
      title: `${query} - 流行歌曲参考`,
      snippet: `包含「${query}」意象的知名歌曲分析：通过研究经典作品中的意象运用方式，可以更好地把握歌词的情感表达节奏。`,
      url: `${SEARCH_BASE}${encodeURIComponent(query + ' 歌词 歌曲')}`,
    },
  ]
}
