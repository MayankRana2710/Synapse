"use client";

import qs from "query-string";
import { 
  usePathname, 
  useRouter, 
  useSearchParams 
} from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video");

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || "",
      query: {
        video: isVideo ? undefined : true,
      }
    }, { skipNull: true });

    router.push(url);
  };

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button 
        onClick={onClick} 
        // Added a subtle frosted background on hover, removed hardcoded margins
        className="flex items-center justify-center p-1.5 rounded-md hover:bg-white/[0.04] transition-colors"
      >
        <Icon 
            strokeWidth={1.7} 
            className="h-5 w-5 text-white/[0.65] hover:text-white/[0.95] transition-colors" 
        />
      </button>
    </ActionTooltip>
  );
};