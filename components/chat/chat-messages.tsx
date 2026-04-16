"use client";

import { Fragment, useRef } from "react";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";

// FIX: Added 'type' keyword to imports. 
// This prevents Prisma's server-only runtime from being pulled into the browser.
import type { Member, Message, Profile } from "@prisma/client";

import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatWelcome } from "./chat-welcome";
import { ChatItem } from "./chat-item";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = Message & {
    member: Member & { profile: Profile; }
};

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ 
        queryKey, apiUrl, paramKey, paramValue 
    });

    useChatSocket({ queryKey, addKey, updateKey });

    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    });

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center bg-transparent">
                <Loader2 className="h-8 w-8 text-white/[0.2] animate-spin mb-4" strokeWidth={1.5} />
                <p className="text-[13px] font-light text-white/[0.3] tracking-[0.3px]">
                    Syncing conversation...
                </p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center bg-transparent">
                <ServerCrash className="h-8 w-8 text-rose-500/40 mb-4" strokeWidth={1.5} />
                <p className="text-[13px] font-medium text-white/[0.3] tracking-[0.2px]">
                    Unable to connect to synapse.
                </p>
            </div>
        )
    }

    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-6 overflow-y-auto bg-transparent scrollbar-hide">
            {!hasNextPage && <div className="flex-1" />}
            {!hasNextPage && (
                <div className="fade-in-up">
                    <ChatWelcome type={type} name={name} />
                </div>
            )}
            {hasNextPage && (
                <div className="flex justify-center py-4">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-5 w-5 text-white/[0.2] animate-spin" strokeWidth={2} />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] font-medium text-white/[0.3] hover:text-white/[0.85] hover:bg-white/[0.08] transition-all tracking-[0.4px] uppercase"
                        >
                            Load History
                        </button>
                    )}
                </div>
            )}
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} className="h-4" />
        </div>
    )
}