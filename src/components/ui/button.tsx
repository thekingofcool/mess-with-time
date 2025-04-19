
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-purple-500/20 text-purple-100 hover:bg-purple-500/30 border border-purple-500/20 [&_svg]:size-4",
        primary: "bg-purple-600/30 text-purple-50 hover:bg-purple-600/40 border border-purple-400/30 shadow-lg shadow-purple-500/20 [&_svg]:size-5",
        secondary: "bg-black/20 text-gray-100 hover:bg-black/30 border border-white/5 [&_svg]:size-4",
        tertiary: "bg-black/10 text-gray-300 hover:bg-black/20 border border-white/5 [&_svg]:size-3.5",
        destructive: "bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-500/20 [&_svg]:size-4",
        outline: "border border-purple-500/20 bg-transparent hover:bg-purple-500/10 text-purple-100 [&_svg]:size-4",
        ghost: "hover:bg-purple-500/10 text-purple-100 [&_svg]:size-4",
        link: "text-purple-400 underline-offset-4 hover:underline [&_svg]:size-4",
      },
      size: {
        default: "h-9 px-4 py-2",
        lg: "h-11 px-6 py-2 text-base",
        md: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        xs: "h-7 px-2 py-1 text-xs",
        icon: "h-9 w-9",
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
