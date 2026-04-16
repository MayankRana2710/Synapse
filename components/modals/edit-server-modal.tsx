'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormItem,
    FormField,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }),
    imageUrl: z.string().min(1, { message: "Server image is required" })
})

export const EditServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === "editServer";
    const { server } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    // Ensures the form fields are updated as soon as the modal data changes
    useEffect(() => {
        if (server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
             <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),0_50px_100px_rgba(0,0,0,0.95),0_20px_40px_rgba(0,0,0,0.6)] text-white p-0 overflow-hidden sm:max-w-[420px]">
                <DialogHeader className="pt-10 px-8 pb-4">
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] leading-tight text-center bg-gradient-to-br from-white/[0.95] from-30% to-white/[0.42] bg-clip-text text-transparent">
                        Server Settings
                    </DialogTitle>
                    <DialogDescription className="text-center text-[14px] font-light tracking-[0.2px] text-white/[0.3] mt-2 leading-relaxed">
                        Update your server's identity. Changes will be visible to all members.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-8 mt-4">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-semibold text-white/[0.3] tracking-[0.8px] uppercase">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="h-11 bg-white/[0.04] border-white/[0.075] rounded-[12px] text-[14px] focus-visible:ring-white/[0.05] transition-all"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[12px] text-rose-400/80 font-medium" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="px-8 pb-8">
                            <Button 
                                disabled={isLoading}
                                variant="primary"
                                className="w-full h-11 text-[14px] font-semibold tracking-tight"
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}