import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
    return (
        <div
            className={cn(
                "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
                {
                    "h-4 w-4": size === "sm",
                    "h-8 w-8": size === "md",
                    "h-12 w-12": size === "lg",
                },
                "text-primary dark:text-primary-foreground",
                className
            )}
            role="status"
            aria-label="loading"
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
} 