"use client"

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & { profile: Profile };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-1.5 text-indigo-400/80" />,
    "ADMIN": <ShieldCheck className="h-4 w-4 ml-1.5 text-rose-400/80" />
}

const formSchema = z.object({
    content: z.string().min(1),
})

export const ChatItem = ({ id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const { onOpen } = useModal();
    const router = useRouter();
    const params = useParams();

    const onMemberClick = () => {
        if (member.id === currentMember.id) return;
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) setIsEditing(false);
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { content: content }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        form.reset({ content: content })
    }, [content, form]);

    const fileType = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;

    return (
        <div className="relative group flex items-center hover:bg-white/[0.015] px-4 py-3 transition-all duration-300 w-full group">
            <div className="flex gap-x-3 items-start w-full">
                <div onClick={onMemberClick} className="cursor-pointer active:scale-95 transition">
                    <UserAvatar src={member.profile.imageUrl} className="h-9 w-9 md:h-9 md:w-9 ring-1 ring-white/[0.07]" />
                </div>
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p onClick={onMemberClick} className="text-[14px] font-semibold text-white/[0.9] hover:text-white transition cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-[11px] font-light text-white/[0.25] tracking-tight">
                            {timestamp}
                        </span>
                    </div>
                    
                    {isImage && (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" 
                           className="relative aspect-square rounded-[12px] mt-2 overflow-hidden border border-white/[0.08] flex items-center bg-white/[0.02] h-64 w-64 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] hover:border-white/[0.2] transition-all">
                            <Image src={fileUrl} alt={content} fill className="object-cover" />
                        </a>
                    )}
                    
                    {isPDF && (
                        <div className="relative flex items-center p-3 mt-2 rounded-[10px] bg-white/[0.04] border border-white/[0.07] group/file max-w-[300px]">
                            <FileIcon className="h-8 w-8 fill-white/[0.05] stroke-white/[0.4]" />
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-3 text-[13px] text-white/[0.7] hover:text-white hover:underline transition-all line-clamp-1">
                                {content || "PDF Document"}
                            </a>
                        </div>
                    )}
                    
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-[14px] font-light leading-[1.5] text-white/[0.65] mt-0.5",
                            deleted && "italic text-white/[0.25] text-[13px]"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] ml-2 font-medium text-white/[0.2] uppercase tracking-wider">(edited)</span>
                            )}
                        </p>
                    )}
                    
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form className="flex items-center w-full gap-x-2 pt-1" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="h-9 bg-white/[0.04] border-white/[0.08] rounded-[8px] text-[14px] focus-visible:ring-white/[0.05]"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} size="sm" variant="primary" className="h-9 px-4 rounded-[8px]">
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1.5 text-white/[0.2] font-light">
                                Press <kbd className="text-white/[0.4]">esc</kbd> to cancel · <kbd className="text-white/[0.4]">enter</kbd> to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            
            {canDeleteMessage && !isEditing && (
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-x-1 absolute -top-4 right-5 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.08] px-1 py-1 rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10">
                    {canEditMessage && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 hover:bg-white/[0.05] rounded-[7px] transition-colors group/edit"
                        >
                            <Edit className="w-4 h-4 text-white/[0.3] group-hover/edit:text-white/[0.8] transition-colors" />
                        </button>
                    )}
                    <button 
                        onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
                        className="p-1.5 hover:bg-rose-500/10 rounded-[7px] transition-colors group/delete"
                    >
                        <Trash className="w-4 h-4 text-white/[0.3] group-hover/delete:text-rose-400 transition-colors" />
                    </button>
                </div>
            )}
        </div>
    )
}