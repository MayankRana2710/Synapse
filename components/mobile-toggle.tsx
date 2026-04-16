"use client";

import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileToggleProps {
    children?: React.ReactNode;
}

export const MobileToggle = ({ children }: MobileToggleProps) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    // Refined ghost-glass trigger: stroke weight 1.5, subtle scale on tap
                    className="md:hidden mr-2 bg-transparent hover:bg-white/[0.05] active:scale-95 transition-all rounded-[10px]"
                >
                    <Menu className="text-white/[0.6] h-5 w-5" strokeWidth={1.5} />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            
            <SheetContent 
                side="left" 
                // Increased width to 330px to give sidebars more breathing room
                // Used backdrop-blur-3xl to create the 'Apple frosted window' effect
                className="p-0 flex gap-0 bg-[#050505]/95 backdrop-blur-3xl border-r border-white/[0.08] w-[330px] outline-none"
            >
                <SheetTitle className="sr-only">Synapse Navigation</SheetTitle>
                
                {children}
            </SheetContent>
        </Sheet>
    );
};
