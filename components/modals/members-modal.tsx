'use client';

import { 
    Check, 
    Gavel, 
    Loader2, 
    MoreVertical, 
    Shield, 
    ShieldAlert, 
    ShieldCheck, 
    ShieldQuestion 
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

// Keeping the logic identical, but styling for the glass aesthetic
const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}

export const MembersModal = () => {
    const router = useRouter();
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "members";
    const { server } = data as { server: any }; // Using any to avoid the Prisma import error for now

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: { serverId: server?.id },
            });

            const response = await axios.delete(url);
            router.refresh();
            onOpen("members", { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId: string, role: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: { serverId: server?.id },
            });

            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen("members", { server: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[0_50px_100px_rgba(0,0,0,0.95)] text-white p-0 overflow-hidden sm:max-w-[480px]">
                <DialogHeader className="pt-10 px-8 pb-4">
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] text-center bg-gradient-to-br from-white to-white/[0.4] bg-clip-text text-transparent">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-[14px] font-light text-white/[0.3] mt-2">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-4 max-h-[420px] px-6 pb-8">
                    {server?.members?.map((member: any) => (
                        <div key={member.id} className="flex items-center gap-x-3 mb-6 group">
                            <UserAvatar 
                                src={member.profile.imageUrl} 
                                className="h-10 w-10 border border-white/[0.05] ring-1 ring-white/[0.05]"
                            />
                            <div className="flex flex-col gap-y-0.5">
                                <div className="text-[14px] font-semibold flex items-center text-white/[0.9]">
                                    {member.profile.name}
                                    {roleIconMap[member.role as keyof typeof roleIconMap]}
                                </div>
                                <p className="text-[12px] text-white/[0.3] font-light tracking-[0.2px]">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="outline-none">
                                            <MoreVertical className="h-4 w-4 text-white/[0.3] hover:text-white transition-colors" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left" className="bg-[#0a0a0a] border-white/[0.08] text-white">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member.role === "GUEST" && (<Check className="h-4 w-4 ml-auto" />)}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                                            <ShieldCheck className="h-4 w-4 mr-2" />
                                                            Moderator
                                                            {member.role === "MODERATOR" && (<Check className="h-4 w-4 ml-auto" />)}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator className="bg-white/[0.05]" />
                                            <DropdownMenuItem onClick={() => onKick(member.id)} className="text-rose-500 focus:text-rose-400 focus:bg-rose-500/10">
                                                <Gavel className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-white/[0.2] ml-auto w-4 h-4" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}