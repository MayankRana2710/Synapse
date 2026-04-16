"use client"

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form"
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>
    name: string
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1),
})

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values)
            form.reset();
            router.refresh()
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                {/* Adjusted container padding for a tighter fit */}
                                <div className="relative px-4 pb-3">
                                    <button
                                        type="button"
                                        onClick={() => onOpen("messageFile", { apiUrl, query })}
                                        // FIX: Use top-1/2 and -translate-y-1/2 for perfect vertical centering.
                                        // Adjusted 'left' to 8 (32px) to look better with the 10px rounded corners.
                                        className="absolute top-[41%] -translate-y-1/2 left-8 h-[24px] w-[24px] bg-white/[0.08] hover:bg-white/[0.12] transition-colors rounded-full flex items-center justify-center border border-white/[0.07] z-20"
                                    >
                                        <Plus strokeWidth={2} className="text-white/[0.65] w-4 h-4" />
                                    </button>
                                    
                                    <Input
                                        disabled={isLoading}
                                        autoComplete="off"
                                        // pl-12 gives exactly enough breathing room for the button
                                        className="pl-12 pr-12 py-4 bg-white/[0.04] border border-white/[0.075] rounded-[10px] text-[14px] text-white/[0.85] placeholder:text-white/[0.16] placeholder:font-light focus-visible:bg-white/[0.06] focus-visible:border-white/[0.2] focus-visible:ring-[3px] focus-visible:ring-white/[0.035] transition-all duration-200 outline-none"
                                        placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                    
                                    <div className="absolute top-[41%] -translate-y-1/2 right-8 z-20">
                                        <EmojiPicker
                                            onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}