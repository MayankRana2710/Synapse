'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteMessage";
    const { apiUrl, query } = data;
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })

            await axios.delete(url);
            onClose();
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
             <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),0_50px_100px_rgba(0,0,0,0.95),0_20px_40px_rgba(0,0,0,0.6)] text-white p-0 overflow-hidden sm:max-w-[420px]">
                <DialogHeader className="pt-10 px-8 pb-2">
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] leading-[1.18] text-center bg-gradient-to-br from-white/[0.95] from-30% to-white/[0.42] bg-clip-text text-transparent">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-[14px] font-light tracking-[0.2px] text-white/[0.3] mt-2">
                        Are you sure you want to do this? <br/> 
                        The message will be permanently deleted. 
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-8 pb-8 pt-6">
                    <div className="flex items-center gap-3 w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            className="flex-1 p-[12.5px] rounded-[10px] text-[14px] font-medium tracking-[0.05px] bg-transparent text-white/[0.65] hover:bg-white/[0.04] hover:text-white/[0.85] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        >
                            Cancel 
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            className="flex-1 p-[12.5px] rounded-[10px] text-[14px] font-medium tracking-[0.05px] bg-white/[0.86] text-black hover:bg-white hover:shadow-[0_6px_36px_rgba(255,255,255,0.22),0_0_80px_rgba(255,255,255,0.06)] hover:-translate-y-[1px] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        >
                            Confirm 
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}