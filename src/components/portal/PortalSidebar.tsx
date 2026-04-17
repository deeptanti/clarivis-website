'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Briefcase, BarChart2,
  Cpu, Globe, Settings, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/leads', label: 'Leads', icon: Users },
  { href: '/portal/clients', label: 'Clients', icon: Briefcase },
  { href: '/portal/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/portal/models', label: 'Model Management', icon: Cpu },
  { href: '/portal/website', label: 'Website', icon: Globe },
  { href: '/portal/settings', label: 'Settings', icon: Settings },
]

export function PortalSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/portal/auth', { method: 'DELETE' })
    router.push('/portal/login')
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} min-h-screen bg-[#0d1117] border-r border-[#1f2937] flex flex-col transition-all duration-300 flex-shrink-0`}>
      <div className="p-4 flex items-center justify-between border-b border-[#1f2937]">
        {!collapsed && (
          <Image src="/images/logo.png" alt="Clarivis Intelligence" width={120} height={30} />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1f2937] ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/portal' && pathname?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[#0F6E56] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-500">{label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#1f2937]">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-600">Deep Tanti</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-[#1f2937] transition-all w-full"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
