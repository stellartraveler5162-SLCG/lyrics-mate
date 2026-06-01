import { Briefcase, Construction } from 'lucide-react'

export default function CommissionPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-accent-50 flex items-center justify-center mx-auto mb-5">
          <Briefcase className="w-10 h-10 text-accent-400" />
        </div>
        <h2 className="text-xl font-bold text-surface-700 mb-2">约稿中心</h2>
        <p className="text-sm text-surface-400 leading-relaxed max-w-xs mx-auto">
          发布歌词创作需求，对接专业词作者
          <br />
          承接约稿任务，让你的才华变现
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-600 rounded-full text-sm font-medium">
          <Construction className="w-4 h-4" />
          即将推出
        </div>
      </div>
    </div>
  )
}
