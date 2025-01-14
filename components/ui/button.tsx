import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps, type Config } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants: Config<{
    size: { default: string, icon: string, sm: string, lg: string },
    variant: { secondary: string, default: string, outline: string, ghost: string, link: string, destructive: string }
}> = {
    variants: {
        size: {
            default: "h-9 px-4 py-2",
            icon: "h-9 w-9",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
        },
        variant: {
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        },
    },
    defaultVariants: {
        size: "default",
        variant: "default",
    },
}

const buttonClasses = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    buttonVariants
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonClasses> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonClasses({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonClasses }