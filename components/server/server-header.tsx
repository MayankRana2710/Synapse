"use client"

import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole, Server } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    if (!isMounted) return null; 

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
                <button className="w-full text-[15px] font-semibold tracking-[0.2px] text-white/[0.85] px-4 flex items-center h-[54px] border-b border-white/[0.045] hover:bg-white/[0.02] transition-colors">
                    {server.name}
                    <ChevronDown strokeWidth={1.5} className="h-5 w-5 ml-auto text-white/[0.3]" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.07] rounded-[12px] p-1.5 text-white/[0.85] shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("invite", { server })}
                        className="text-white/[0.95] px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06] rounded-[8px] transition-colors">
                        Invite People
                        <UserPlus strokeWidth={1.5} className="h-4 w-4 ml-auto text-white/[0.65]"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })} 
                        className="px-3 py-2 text-[13px] font-medium text-white/[0.65] cursor-pointer hover:bg-white/[0.06] hover:text-white/[0.85] focus:bg-white/[0.06] focus:text-white/[0.85] rounded-[8px] transition-colors">
                        Server Settings
                        <Settings strokeWidth={1.5} className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("members", { server })} 
                        className="px-3 py-2 text-[13px] font-medium text-white/[0.65] cursor-pointer hover:bg-white/[0.06] hover:text-white/[0.85] focus:bg-white/[0.06] focus:text-white/[0.85] rounded-[8px] transition-colors">
                        Manage Members
                        <Users strokeWidth={1.5} className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("createChannel")}
                        className="px-3 py-2 text-[13px] font-medium text-white/[0.65] cursor-pointer hover:bg-white/[0.06] hover:text-white/[0.85] focus:bg-white/[0.06] focus:text-white/[0.85] rounded-[8px] transition-colors">
                        Create Channel
                        <PlusCircle strokeWidth={1.5} className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator className="bg-white/[0.07] my-1"/>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("deleteServer", { server })} 
                        className="text-rose-400 px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 rounded-[8px] transition-colors">
                        Delete Server
                        <Trash strokeWidth={1.5} className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem 
                        onClick={() => onOpen("leaveServer", { server })}
                        className="text-rose-400 px-3 py-2 text-[13px] font-medium cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 rounded-[8px] transition-colors">
                        Leave Server
                        <LogOut strokeWidth={1.5} className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>    
        </DropdownMenu>    
    )
}

export default ServerHeader