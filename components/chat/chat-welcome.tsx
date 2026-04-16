import { Hash } from "lucide-react";

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
    return (
        <div className="px-4 mb-8 mt-auto">
            {type === "channel" && (
                // Replaced the solid circle with a frosted-glass squircle
                <div className="mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-white/[0.04] border border-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]">
                    <Hash strokeWidth={1.5} className="h-8 w-8 text-white/[0.65]" />
                </div>
            )}
            
            <div className="space-y-1.5">
                {/* Apple-style hero typography: very tight tracking, near-white */}
                <h3 className="text-[32px] font-semibold tracking-[-1.2px] leading-[1.1] text-white/[0.95]">
                    {type === "channel" ? "Welcome to #" : ""}{name}
                </h3>
                
                {/* Muted 30% text for the subtitle */}
                <p className="text-[14px] font-light tracking-[0.2px] text-white/[0.3]">
                    {type === "channel"
                        ? `This is the start of the #${name} channel.`
                        : `This is the start of your conversation with ${name}.`
                    }
                </p>
            </div>
        </div>
    )
}