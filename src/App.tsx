import { Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import HomePage from '@/pages/HomePage'
import CommunityPage from '@/pages/CommunityPage'
import CommissionPage from '@/pages/CommissionPage'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-gradient-to-br from-surface-50 via-white to-primary-50/40">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/commission" element={<CommissionPage />} />
        </Routes>
      </main>
    </div>
  )
}
