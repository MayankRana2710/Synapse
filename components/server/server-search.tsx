"use client"

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string;
        type: "channel" | "member"
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined
    }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down)
    }, []);

    const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setOpen(false)
        if (type === "member") return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        if (type === "channel") return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)} 
                className="group px-2 py-2 rounded-[8px] flex items-center gap-x-2 w-full hover:bg-white/[0.02] transition-colors"
            >
                <Search strokeWidth={1.7} className="w-4 h-4 text-white/[0.3] group-hover:text-white/[0.65] transition-colors" />
                <p className="font-medium text-[14px] text-white/[0.3] group-hover:text-white/[0.65] transition-colors">
                    Search
                </p>
                {/* Styled the keyboard shortcut as a little glass pill */}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-[4px] border border-white/[0.07] bg-white/[0.04] px-1.5 font-mono text-[10px] font-medium text-white/[0.3] ml-auto">
                    <span className="text-[10px]">CTRL</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No Results found</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem key={id} onSelect={() => onClick({ id, type })}>
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default ServerSearch