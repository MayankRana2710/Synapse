import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation";
import { db } from "@/lib/db"

import NavigationAction from "./navigation-action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    const servers = await db.server.findMany({
        where: {
            members: { some: { profileId: profile.id } }
        }
    });

    return (
        <div className="space-y-4 flex flex-col items-center h-full w-full bg-[#000] py-4 border-r border-white/[0.02]">
            <NavigationAction />
            
            <div className="h-[1px] w-8 bg-white/[0.06] rounded-full mx-auto" />
            
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4"> 
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            
            <div className="pb-4 mt-auto flex items-center flex-col gap-y-4">
                {/* ModeToggle is kept for logic, but styled minimally */}
                <div className="opacity-40 hover:opacity-100 transition-opacity">
                    <ModeToggle />
                </div>
                
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "h-[44px] w-[44px] ring-1 ring-white/[0.08] rounded-[14px] hover:ring-white/[0.3] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl"
                        }
                    }}
                />
            </div>
        </div>
    )
}