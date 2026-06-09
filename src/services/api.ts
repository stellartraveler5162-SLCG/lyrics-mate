import type { CommunityPost, Commission, CommissionBid, PaginatedResponse, User } from '@/types'
import { getToken } from '@/store/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://156.239.236.41:3001/api'
const REQUEST_TIMEOUT_MS = 15000

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...authHeaders() }
    if (options?.headers) {
      Object.assign(headers, options.headers instanceof Headers ? Object.fromEntries(options.headers.entries()) : options.headers)
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error((body as { error?: string }).error || `请求失败 (${res.status})`)
    }
    return res.json()
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络连接')
    }
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error('无法连接服务器，请检查网络')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// ─── Auth ───

export async function register(username: string, password: string): Promise<{ token: string; user: User }> {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) })
}

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
}

export async function fetchMe(): Promise<{ user: User }> {
  return request('/auth/me')
}

// ─── Community ───

export async function fetchCommunityPosts(page = 1, limit = 20, sort?: string): Promise<PaginatedResponse<CommunityPost>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (sort) params.set('sort', sort)
  return request(`/community?${params}`)
}

export async function fetchCommunityPost(id: string): Promise<CommunityPost & { liked_by_me?: boolean }> {
  return request(`/community/${id}`)
}

export async function createCommunityPost(data: { title: string; lyrics: string; tags?: string[] }): Promise<CommunityPost> {
  return request('/community', { method: 'POST', body: JSON.stringify(data) })
}

export async function deleteCommunityPost(id: string): Promise<void> {
  return request(`/community/${id}`, { method: 'DELETE' })
}

export async function likeCommunityPost(id: string): Promise<{ likes: number }> {
  return request(`/community/${id}/like`, { method: 'POST' })
}

// ─── Commission ───

export async function fetchCommissions(page = 1, limit = 20, status?: string): Promise<PaginatedResponse<Commission>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) params.set('status', status)
  return request(`/commissions?${params}`)
}

export async function fetchCommission(id: string): Promise<Commission> {
  return request(`/commissions/${id}`)
}

export async function createCommission(data: { title: string; description?: string; budget?: string; tags?: string[] }): Promise<Commission> {
  return request('/commissions', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateCommission(id: string, data: { status?: Commission['status']; title?: string; description?: string; budget?: string }): Promise<Commission> {
  return request(`/commissions/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function deleteCommission(id: string): Promise<void> {
  return request(`/commissions/${id}`, { method: 'DELETE' })
}

export async function createBid(commissionId: string, data: { message?: string; sample?: string }): Promise<CommissionBid> {
  return request(`/commissions/${commissionId}/bids`, { method: 'POST', body: JSON.stringify(data) })
}
