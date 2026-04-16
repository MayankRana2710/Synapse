import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles: removed default focus rings, added spring transition
  "inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-[14px] font-medium tracking-[0.05px] ring-offset-background transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // Your Primary CTA: Near-white, black text, lifts up with sweeping shadow
        default: "bg-white/[0.86] text-black hover:bg-white hover:shadow-[0_6px_36px_rgba(255,255,255,0.22),0_0_80px_rgba(255,255,255,0.06)] hover:-translate-y-[1px] active:scale-[0.99] disabled:bg-white/[0.07] disabled:text-white/[0.18]",
        
        // Primary variant alias (since your code uses variant="primary" often)
        primary: "bg-white/[0.86] text-black hover:bg-white hover:shadow-[0_6px_36px_rgba(255,255,255,0.22),0_0_80px_rgba(255,255,255,0.06)] hover:-translate-y-[1px] active:scale-[0.99] disabled:bg-white/[0.07] disabled:text-white/[0.18]",
        
        // Destructive: Muted rose glass
        destructive: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:scale-[0.99]",
        
        // Outline: Ghost border
        outline: "border border-white/[0.07] bg-white/[0.02] text-white/[0.65] hover:bg-white/[0.06] hover:text-white/[0.85] active:scale-[0.99]",
        
        // Secondary: Slightly more visible glass
        secondary: "bg-white/[0.07] text-white/[0.85] hover:bg-white/[0.12] active:scale-[0.99]",
        
        // Ghost: Invisible until hover
        ghost: "bg-transparent text-white/[0.65] hover:bg-white/[0.04] hover:text-white/[0.85] active:scale-[0.99]",
        
        // Link: Clean text transition
        link: "text-white/[0.3] hover:text-white/[0.85] underline-offset-4 hover:underline",
      },
      size: {
        default: "px-[14px] py-[11.5px]",
        sm: "h-9 px-3 text-xs rounded-[8px]",
        lg: "h-11 px-8 rounded-[12px]",
        icon: "h-10 w-10 flex items-center justify-center rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }