"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ActionTooltip } from "../action-tooltip"

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();
    
    const isActive = params?.serverId === id;
    
    const onClick = () => {
        router.push(`/servers/${id}`)
    }
    
    return (
        <ActionTooltip
            side="right"
            align="center"
            label={name}
        >
            <button 
                onClick={onClick}
                className="group relative flex items-center outline-none"    
            >
                {/* Active Indicator: Perfectly smooth pill with spring-like easing */}
                <div className={cn(
                    "absolute left-0 bg-white/[0.9] rounded-r-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-[3.5px]",
                    !isActive && "group-hover:h-[20px]",
                    isActive ? "h-[36px]" : "h-[8px]"
                )}/>
                
                {/* Icon Wrapper: Added inner glow and specific active border */}
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
                    isActive && "bg-white/[0.1] border-white/[0.2] rounded-[16px] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                )}>
                    <Image
                        fill
                        src={imageUrl}
                        alt={name}
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-105",
                            isActive && "scale-105"
                        )}
                    />
                </div>
            </button>
        </ActionTooltip>
    )
}