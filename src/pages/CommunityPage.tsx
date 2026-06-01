import { Users } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="h-full flex items-center justify-center texture-paper">
      <div className="text-center animate-fade-up">
        <div className="w-16 h-16 rounded-xl bg-ink-800/5 flex items-center justify-center mx-auto mb-5">
          <Users className="w-8 h-8 text-ink-800" strokeWidth={1.2} />
        </div>
        <h2 className="text-xl font-bold text-ink-800 mb-2 tracking-wide">社区广场</h2>
        <p className="text-sm text-ink-400 leading-relaxed max-w-xs mx-auto">
          分享你的歌词作品，与其他创作者交流灵感
          <br />
          发现优秀词作，获得创作反馈
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-ink-800/5 text-ink-500 rounded-full text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-vermilion-500" />
          即将推出
        </div>
      </div>
    </div>
  )
}
