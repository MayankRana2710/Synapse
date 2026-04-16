'use client';

import qs from "query-string"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Dialog,
    DialogContent,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, { message: "Channel name is required" }).refine(
        name => name !== "general", { message: "Channel name cannot be 'general'" }
    ),
    type: z.nativeEnum(ChannelType)
})

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const { channel, server } = data;

    const isModalOpen = isOpen && type === "editChannel";
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT,
        }
    });

    useEffect(() => {
        if (channel) {
            form.setValue("name", channel.name);
            form.setValue("type", channel.type);
        }
    }, [channel, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: { serverId: server?.id }
            });
            await axios.patch(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
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
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] leading-[1.18] text-center bg-gradient-to-br from-white/[0.95] from-30% to-white/[0.42] bg-clip-text text-transparent">
                        Edit Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6 px-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12.5px] font-medium text-white/[0.3] tracking-[0.4px] uppercase">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="py-[11.5px] px-[14px] bg-white/[0.04] border border-white/[0.075] rounded-[10px] text-[14px] text-white/[0.85] placeholder:text-white/[0.16] placeholder:font-light focus-visible:bg-white/[0.06] focus-visible:border-white/[0.2] focus-visible:ring-[3px] focus-visible:ring-white/[0.035] transition-all duration-200 outline-none"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[12.5px] text-rose-400/90" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[12.5px] font-medium text-white/[0.3] tracking-[0.4px] uppercase">
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="py-[11.5px] px-[14px] bg-white/[0.04] border border-white/[0.075] rounded-[10px] text-[14px] text-white/[0.85] focus:bg-white/[0.06] focus:border-white/[0.2] focus:ring-[3px] focus:ring-white/[0.035] transition-all duration-200 outline-none capitalize"
                                                >
                                                    <SelectValue placeholder="Select a channel type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.07] rounded-[10px] text-white/[0.85]">
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize hover:bg-white/[0.04] focus:bg-white/[0.04] text-[14px] cursor-pointer rounded-md transition-colors"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-[12.5px] text-rose-400/90" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="px-8 pb-8 pt-4">
                            <Button 
                                disabled={isLoading}
                                className="w-full p-[12.5px] rounded-[10px] text-[14px] font-medium tracking-[0.05px] bg-white/[0.86] text-black hover:bg-white hover:shadow-[0_6px_36px_rgba(255,255,255,0.22),0_0_80px_rgba(255,255,255,0.06)] hover:-translate-y-[1px] active:scale-[0.99] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:bg-white/[0.07] disabled:text-white/[0.18] disabled:hover:translate-y-0 disabled:active:scale-100 disabled:shadow-none"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}