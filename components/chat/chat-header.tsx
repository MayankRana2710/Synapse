'use client';

import { Hash, Menu, Mic, Video } from "lucide-react";

import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
// import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-4 flex items-center h-14 border-b border-white/[0.04] bg-transparent backdrop-blur-sm sticky top-0 z-50">
            <MobileToggle />

            {type === "channel" && (
                <div className="flex items-center justify-center h-7 w-7 rounded-[8px] bg-white/[0.03] border border-white/[0.08] mr-3">
                    <Hash className="h-4 w-4 text-white/[0.3]" />
                </div>
            )}

            {type === "conversation" && (
                <UserAvatar 
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-3 ring-1 ring-white/[0.08]"
                />
            )}

            <p className="font-bold text-[15px] tracking-tight text-white/[0.9]">
                {name}
            </p>

            <div className="ml-auto flex items-center gap-x-4">
                {type === "conversation" && (
                    <div className="flex items-center gap-x-2 mr-2">
                        <button className="p-2 rounded-[10px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] transition-all group">
                            <Mic className="h-4 w-4 text-white/[0.3] group-hover:text-white/[0.8]" />
                        </button>
                        <button className="p-2 rounded-[10px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] transition-all group">
                            <Video className="h-4 w-4 text-white/[0.3] group-hover:text-white/[0.8]" />
                        </button>
                    </div>
                )}
                {type === "channel" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}