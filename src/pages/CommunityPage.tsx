import { Users, Construction } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <Users className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="text-xl font-bold text-surface-700 mb-2">社区广场</h2>
        <p className="text-sm text-surface-400 leading-relaxed max-w-xs mx-auto">
          分享你的歌词作品，与其他创作者交流灵感
          <br />
          发现优秀词作，获得创作反馈
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-600 rounded-full text-sm font-medium">
          <Construction className="w-4 h-4" />
          即将推出
        </div>
      </div>
    </div>
  )
}
