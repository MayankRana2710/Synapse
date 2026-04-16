"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="bg-transparent border-transparent">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent border-0">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



// "use client";

// import { Menu } from "lucide-react";

// import {
//     Sheet,
//     SheetContent,
//     SheetTrigger,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
// import { ServerSidebar } from "@/components/server/server-sidebar";

// export const MobileToggle = ({
//     serverId
// }: {
//     serverId: string;
// }) => {
//     return (
//         <Sheet>
//             <SheetTrigger asChild>
//                 <Button 
//                     variant="ghost" 
//                     size="icon" 
//                     className="md:hidden p-2 rounded-[10px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] transition-all mr-2"
//                 >
//                     <Menu className="text-white/[0.5]" />
//                 </Button>
//             </SheetTrigger>
//             <SheetContent 
//                 side="left" 
//                 className="p-0 flex gap-0 bg-[#050505] border-r border-white/[0.05]"
//             >
//                 {/* Fixed width for the primary navigation icon bar */}
//                 <div className="w-[72px]">
//                     <NavigationSidebar />
//                 </div>
//                 {/* The rest of the sheet is the server-specific sidebar */}
//                 <div className="flex-1 bg-[#050505]/50 backdrop-blur-md">
//                     <ServerSidebar serverId={serverId} />
//                 </div>
//             </SheetContent>
//         </Sheet>
//     )
// }