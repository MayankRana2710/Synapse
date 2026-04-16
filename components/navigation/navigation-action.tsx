"use client"

import { Plus } from "lucide-react"
import { ActionTooltip } from "../action-tooltip"
import { useModal } from "@/hooks/use-modal-store";

const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div className="relative group">
            <ActionTooltip
                side="right"
                align="center"
                label="Create a Server"    
            >
                <button 
                    onClick={() => onOpen("createServer")} 
                    className="group flex items-center outline-none"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden items-center justify-center bg-white/[0.03] border border-white/[0.08] group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <Plus
                            strokeWidth={1.5}
                            className="text-white/[0.4] group-hover:text-white transition-colors duration-300"
                            size={22}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}

export default NavigationAction;