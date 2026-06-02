import type { CommunityPost, Commission, CommissionBid, PaginatedResponse, User } from '@/types'
import { getToken } from '@/store/auth'

const BASE_URL = 'http://156.239.236.41:3001/api'

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
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

export async function fetchCommunityPost(id: string): Promise<CommunityPost> {
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

export async function updateCommission(id: string, data: { status?: string; title?: string; description?: string; budget?: string }): Promise<Commission> {
  return request(`/commissions/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function deleteCommission(id: string): Promise<void> {
  return request(`/commissions/${id}`, { method: 'DELETE' })
}

export async function createBid(commissionId: string, data: { message?: string; sample?: string }): Promise<CommissionBid> {
  return request(`/commissions/${commissionId}/bids`, { method: 'POST', body: JSON.stringify(data) })
}
