import { PortalSidebar } from '@/components/portal/PortalSidebar'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] flex">
      <PortalSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
