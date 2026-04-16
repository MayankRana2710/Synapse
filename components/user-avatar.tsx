import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  className?: string;
};

export const UserAvatar = ({
  src,
  className
}: UserAvatarProps) => {
  return (
    <Avatar className={cn(
      "h-7 w-7 md:h-10 md:w-10 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
      className
    )}>
      <AvatarImage 
        src={src} 
        className="object-cover"
      />
    </Avatar>
  )
}