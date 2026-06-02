import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, Music } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import * as api from '@/services/api'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空')
      return
    }
    setLoading(true)
    try {
      const fn = mode === 'login' ? api.login : api.register
      const { token, user } = await fn(username.trim(), password)
      setAuth(token, user)
      navigate('/')
    } catch (err: any) {
      setError(err.message || '操作失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-paper-50 texture-paper">
      <div className="w-[360px]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-ink-900 flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-paper-300" strokeWidth={1.8} />
          </div>
          <h1 className="text-xl font-bold text-ink-800 tracking-wide">词伴 Lyrics Mate</h1>
          <p className="text-sm text-ink-400 mt-1">登录后数据云端同步，跨设备共享</p>
        </div>

        <div className="panel-card rounded-2xl p-6 animate-fade-up">
          <div className="flex bg-paper-100 p-[3px] rounded-lg mb-6">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-white text-ink-800 shadow-paper' : 'text-ink-300'
              }`}
            >
              <LogIn className="w-4 h-4" strokeWidth={1.8} />
              登录
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-white text-ink-800 shadow-paper' : 'text-ink-300'
              }`}
            >
              <UserPlus className="w-4 h-4" strokeWidth={1.8} />
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 px-3 py-2 bg-vermilion-50 border border-vermilion-200 rounded-lg text-xs text-vermilion-700">
                {error}
              </div>
            )}

            <div className="mb-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="用户名"
                autoFocus
                className="w-full px-3 py-2.5 text-sm bg-paper-100 border border-paper-200 rounded-lg
                  focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
                  placeholder:text-ink-300 transition-all text-ink-700"
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full px-3 py-2.5 text-sm bg-paper-100 border border-paper-200 rounded-lg
                  focus:outline-none focus:border-ink-300 focus:ring-1 focus:ring-ink-200
                  placeholder:text-ink-300 transition-all text-ink-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ink-800 text-paper-50 rounded-lg hover:bg-ink-900
                disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[10px] text-ink-300">
          注册即表示你同意数据存储于云端服务器
        </p>
      </div>
    </div>
  )
}
