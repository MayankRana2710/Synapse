import { NavigationSidebar } from '@/components/navigation/navigation-sidebar'
import React from 'react'

const MainLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
        {/* Sidebar Container:
            Invisible background, subtle 4.5% white right border to frame it 
            without boxing it in. Z-index 30 keeps it above the ambient orbs.
        */}
        <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0 border-r border-white/[0.045] bg-transparent">
            <NavigationSidebar />
        </div>
        
        <main className="md:pl-[72px] h-full w-full relative z-10">
            {children}
        </main>
    </div>
  )
}

export default MainLayout