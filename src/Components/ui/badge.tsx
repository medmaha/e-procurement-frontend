import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/ui/utils";

const badgeVariants = cva(
  "inline-flex gap-1.5 items-center capitalize rounded-full border cursor-default px-2.5 py-0.5 text-xs sm:font-semibold",
  {
    variants: {
      variant: {
        default: "border-primary/50 bg-transparent text-primary/80",
        success: "border-success/60 bg-transparent text-success/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-accent border-2 bg-transparent text-destructive",
        outline: "text-foreground border-foreground/30 text-foreground/80 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
