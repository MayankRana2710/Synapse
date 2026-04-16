'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        if (!inviteUrl) return;
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite", { server: response.data });
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),0_50px_100px_rgba(0,0,0,0.95),0_20px_40px_rgba(0,0,0,0.6)] text-white p-0 overflow-hidden sm:max-w-[420px]">
                <DialogHeader className="pt-10 px-8 pb-4">
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] leading-tight text-center bg-gradient-to-br from-white/[0.95] from-30% to-white/[0.42] bg-clip-text text-transparent">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                
                <div className="px-8 pb-8">
                    <Label className="text-[11px] font-semibold text-white/[0.3] tracking-[0.8px] uppercase">
                        Server invite link
                    </Label>
                    
                    <div className="relative flex items-center mt-3 group">
                        <Input
                            disabled={isLoading}
                            className="h-11 pl-4 pr-12 bg-white/[0.04] border border-white/[0.075] rounded-[12px] text-[14px] text-white/[0.85] focus-visible:ring-white/[0.05] transition-all outline-none"
                            value={inviteUrl || ""}
                            readOnly
                        />
                        <button 
                            disabled={isLoading} 
                            onClick={onCopy}
                            className="absolute right-1.5 h-8 w-8 rounded-[8px] bg-white/[0.07] hover:bg-white/[0.12] text-white/[0.6] hover:text-white transition-all flex items-center justify-center active:scale-90"
                        >
                            {copied 
                                ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                                : <Copy className="w-3.5 h-3.5" />
                            }
                        </button>
                    </div>

                    <button 
                        onClick={onNew}
                        disabled={isLoading}
                        className="group flex items-center text-[11px] font-medium text-white/[0.25] hover:text-white/[0.8] transition-all mt-4 tracking-[0.4px] uppercase outline-none"
                    >
                        Generate a new link
                        <RefreshCw className={cn(
                            "h-3 w-3 ml-2 transition-transform duration-500",
                            isLoading ? "animate-spin" : "group-hover:rotate-180"
                        )} />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}