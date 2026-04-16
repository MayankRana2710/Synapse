"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <Badge 
                variant="outline" 
                className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full"
            >
                Fallback: Polling
            </Badge>
        )
    }

    return (
        <Badge 
            variant="outline" 
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]"
        >
            Live
        </Badge>
    )
}