'use client';

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            });

            await axios.delete(url);

            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[0_50px_100px_rgba(0,0,0,0.95)] text-white p-0 overflow-hidden sm:max-w-[420px]">
                <DialogHeader className="pt-10 px-8 pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20">
                            <AlertTriangle className="h-6 w-6 text-rose-500" />
                        </div>
                    </div>
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] text-center bg-gradient-to-br from-white to-white/[0.4] bg-clip-text text-transparent">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-[14px] font-light text-white/[0.3] mt-3 px-2">
                        Are you sure you want to delete <span className="font-semibold text-rose-400/80">#{channel?.name}</span>? This action is permanent.
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="px-8 pb-8 pt-4 flex items-center justify-between gap-x-3">
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="ghost"
                        className="flex-1 h-11 rounded-[12px] text-white/[0.4] hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={onClick}
                        className="flex-1 h-11 rounded-[12px] bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-[0_0_20px_rgba(225,29,72,0.2)] active:scale-[0.98] transition-all"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}