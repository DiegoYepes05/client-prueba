import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface SpinnerProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 16,
  md: 32,
  lg: 48,
} as const;

function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className="animate-spin text-muted-foreground"
        size={sizeMap[size]}
      />
    </div>
  );
}

export { Spinner };
