import { NavLink, useLocation } from 'react-router-dom'
import { PenLine, Users, Briefcase } from 'lucide-react'

const navItems = [
  { to: '/', icon: PenLine, label: '创作', exact: true },
  { to: '/community', icon: Users, label: '社区', badge: '随后' },
  { to: '/commission', icon: Briefcase, label: '约稿', badge: '随后' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-[68px] bg-white/70 backdrop-blur-sm border-r border-paper-200 flex flex-col items-center py-5 gap-1 shrink-0">
      <div className="mb-5 mt-1">
        <div className="w-9 h-9 rounded-lg bg-ink-900 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8e1d5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
      </div>

      {navItems.map(({ to, icon: Icon, label, badge }) => {
        const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
        return (
          <NavLink
            key={to}
            to={to}
            className={`
              relative group flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg
              transition-all duration-200 w-[54px]
              ${isActive
                ? 'bg-paper-200 text-ink-800'
                : 'text-ink-300 hover:text-ink-600 hover:bg-paper-100'
              }
            `}
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
            <span className="text-[10px] font-medium leading-none tracking-wide">{label}</span>
            {badge && (
              <span className="absolute -top-0.5 -right-0.5 text-[8px] bg-vermilion-100 text-vermilion-600 px-1.5 py-[1px] rounded-full font-medium leading-none whitespace-nowrap">
                {badge}
              </span>
            )}
          </NavLink>
        )
      })}
    </aside>
  )
}
