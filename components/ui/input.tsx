import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full py-[11.5px] px-[14px] bg-white/[0.04] border border-white/[0.075] rounded-[10px] text-[14px] text-white/[0.85] placeholder:text-white/[0.16] placeholder:font-light focus-visible:bg-white/[0.06] focus-visible:border-white/[0.2] focus-visible:ring-[3px] focus-visible:ring-white/[0.035] transition-all duration-200 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }