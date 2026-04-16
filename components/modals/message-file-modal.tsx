'use client';

import axios from "axios";
import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })
});

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "messageFile";
    const { apiUrl, query } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[0_50px_100px_rgba(0,0,0,0.95)] text-white p-0 overflow-hidden sm:max-w-[420px]">
                <DialogHeader className="pt-10 px-8 pb-4">
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] text-center bg-gradient-to-br from-white to-white/[0.4] bg-clip-text text-transparent">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-[14px] font-light text-white/[0.3] mt-2">
                        Send a file as a message.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-8">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                {/* FileUpload should handle the glass styling for the dropzone */}
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="px-8 pb-8 pt-4">
                            <Button 
                                variant="primary" 
                                disabled={isLoading}
                                className="w-full h-11 rounded-[12px] bg-white text-black hover:bg-white/90 transition-all font-semibold active:scale-[0.98]"
                            >
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}