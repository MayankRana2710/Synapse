"use client";

import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({
  onChange,
}: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile
          strokeWidth={1.5}
          className="text-white/[0.3] hover:text-white transition"
        />
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        sideOffset={40}
        // Applying the dark glass theme to the popover container
        className="bg-[#0a0a0a]/90 backdrop-blur-xl border-white/[0.08] shadow-2xl drop-shadow-2xl mb-16"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          // Customizing the picker internal styles to match
          set="apple"
          icons="outline"
        />
      </PopoverContent>
    </Popover>
  )
}