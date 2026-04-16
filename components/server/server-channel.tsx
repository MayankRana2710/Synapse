"use client"

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter(); 

    const Icon = iconMap[channel.type];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { channel, server })
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-[8px] flex items-center gap-x-2 w-full hover:bg-white/[0.02] transition-colors mb-[2px]",
                params?.channelId === channel.id && "bg-white/[0.06]"
            )}
        >
            <Icon 
                strokeWidth={1.7} 
                className={cn(
                    "flex-shrink-0 w-4 h-4 text-white/[0.3] group-hover:text-white/[0.65] transition-colors",
                    params?.channelId === channel.id && "text-white/[0.85]"
                )} 
            />
            <p className={cn(
                "line-clamp-1 text-[14px] text-white/[0.65] group-hover:text-white/[0.85] transition-colors font-medium",
                params?.channelId === channel.id && "text-white/[0.95]"
            )}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={(e) => onAction(e, "editChannel")}
                            className="hidden group-hover:block w-3.5 h-3.5 text-white/[0.3] hover:text-white/[0.85] transition-colors"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={(e) => onAction(e, "deleteChannel")}
                            className="hidden group-hover:block w-3.5 h-3.5 text-white/[0.3] hover:text-rose-400 transition-colors"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock strokeWidth={1.7} className="ml-auto w-3.5 h-3.5 text-white/[0.3]" />
            )}
        </button>
    )
}