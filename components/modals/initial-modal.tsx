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
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is required" }),
    imageUrl: z.string().min(1, { message: "Server image is required" })
})

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true)
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="bg-[#050505]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035),0_50px_100px_rgba(0,0,0,0.95),0_20px_40px_rgba(0,0,0,0.6)] text-white p-0 overflow-hidden sm:max-w-[420px]">
                <DialogHeader className="pt-10 px-8 pb-4">
                    <DialogTitle className="text-[24px] font-semibold tracking-[-0.8px] leading-[1.18] text-center bg-gradient-to-br from-white/[0.95] from-30% to-white/[0.42] bg-clip-text text-transparent">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-[14px] font-light tracking-[0.2px] text-white/[0.3] mt-2">
                        Give your server a personality with a name and an image.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6 px-8">
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
                                        <FormLabel className="text-[12.5px] font-medium text-white/[0.3] tracking-[0.4px] uppercase">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="py-[11.5px] px-[14px] bg-white/[0.04] border border-white/[0.075] rounded-[10px] text-[14px] text-white/[0.85] placeholder:text-white/[0.16] placeholder:font-light focus-visible:bg-white/[0.06] focus-visible:border-white/[0.2] focus-visible:ring-[3px] focus-visible:ring-white/[0.035] transition-all duration-200 outline-none"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
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
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}