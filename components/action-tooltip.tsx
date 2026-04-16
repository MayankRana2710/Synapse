"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActionTooltipProps {
    label: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
}

export const ActionTooltip = ({ label, children, side, align }: ActionTooltipProps) => {
    return (
        <TooltipProvider>
            {/* Reduced delay for that snappy, instant-feedback feel */}
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent 
                    side={side} 
                    align={align}
                    // Glass pill styling with specific Synapse shadow
                    className="z-[100] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] px-2.5 py-1 rounded-[7px] shadow-[0_8px_30px_rgb(0,0,0,0.5)] animate-in fade-in-0 zoom-in-95"
                >
                    <p className="font-semibold text-[11px] tracking-[0.4px] text-white/[0.9] uppercase">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}