"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();
    return (
        <div className="flex items-center justify-between py-2 pt-4">
            <p className="text-[11px] uppercase font-semibold tracking-[0.4px] text-white/[0.3]">
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label="Create Channel" side="top">
                    <button 
                        onClick={() => onOpen("createChannel", { channelType })}
                        className="text-white/[0.3] hover:text-white/[0.85] transition-colors"
                    >
                        <Plus strokeWidth={1.7} className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button 
                        onClick={() => onOpen("members", { server })}
                        className="text-white/[0.3] hover:text-white/[0.85] transition-colors"
                    >
                        <Settings strokeWidth={1.7} className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    )
}