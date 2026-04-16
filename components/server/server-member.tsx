"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400 opacity-80"/>,
    [MemberRole.ADMIN]: <ShieldCheck className="h-4 w-4 ml-2 text-rose-400 opacity-80"/>,
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }
    
    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-[8px] flex items-center gap-x-2 w-full hover:bg-white/[0.02] transition-colors mb-[2px]",
                params?.memberId === member.id && "bg-white/[0.06]"
            )}
        >
            <UserAvatar 
                src={member.profile.imageUrl}
                className="h-7 w-7 md:h-7 md:w-7 ring-1 ring-white/[0.07]"
            />
            <p className={cn(
                "font-medium text-[14px] text-white/[0.65] group-hover:text-white/[0.85] transition-colors",
                params?.memberId === member.id && "text-white/[0.95]"
            )}>
                {member.profile.name}
            </p>
            {icon}
        </button>
    )
}