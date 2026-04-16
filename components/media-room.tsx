"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  returnUrl?: string;
};

export const MediaRoom = ({ chatId, video, audio, returnUrl }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        {/* Adjusted loader to use specific opacity values */}
        <Loader2 className="h-7 w-7 text-white/[0.3] animate-spin my-4" />
        <p className="text-[12px] font-light tracking-[0.2px] text-white/[0.3]">
          Loading interface...
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      onDisconnected={() => {
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          window.history.back();
        }
      }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}