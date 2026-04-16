import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base: Frosted pill shape with tight tracking and medium weight
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.3px] uppercase transition-colors focus:outline-none backdrop-blur-md",
  {
    variants: {
      variant: {
        // Standard glass pill
        default:
          "border-white/[0.08] bg-white/[0.04] text-white/[0.85] shadow-none",
        // Subtler glass
        secondary:
          "border-white/[0.05] bg-white/[0.02] text-white/[0.45] hover:bg-white/[0.05]",
        // Red glass for alerts
        destructive:
          "border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-none",
        // Pure ghost badge
        outline: "text-white/[0.3] border-white/[0.07] bg-transparent",
        // Success glass (for Live indicators)
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }