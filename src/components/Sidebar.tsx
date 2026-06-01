import { NavLink, useLocation } from 'react-router-dom'
import { PenLine, Lightbulb, Users, Briefcase, Music } from 'lucide-react'

const navItems = [
  { to: '/', icon: PenLine, label: '创作', exact: true },
  { to: '/community', icon: Users, label: '社区', badge: '即将推出' },
  { to: '/commission', icon: Briefcase, label: '约稿', badge: '即将推出' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[72px] bg-white/80 backdrop-blur-xl border-r border-surface-200 flex flex-col items-center py-6 gap-2 shrink-0">
      <div className="mb-6 mt-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <Music className="w-5 h-5 text-white" />
        </div>
      </div>

      {navItems.map(({ to, icon: Icon, label, badge }) => {
        const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
        return (
          <NavLink
            key={to}
            to={to}
            className={`
              relative group flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl
              transition-all duration-200 w-[56px]
              ${isActive
                ? 'bg-primary-50 text-primary-600'
                : 'text-surface-400 hover:text-surface-600 hover:bg-surface-100'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">{label}</span>
            {badge && (
              <span className="absolute -top-1 -right-1 text-[9px] bg-accent-100 text-accent-600 px-1.5 py-0.5 rounded-full font-medium leading-none whitespace-nowrap">
                {badge}
              </span>
            )}
          </NavLink>
        )
      })}
    </aside>
  )
}
