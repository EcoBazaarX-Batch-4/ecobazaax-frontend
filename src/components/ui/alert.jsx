import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full max-w-xs items-center gap-3 rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-foreground border",
        success: "bg-green-50 border-green-200 text-green-800",
        destructive: "bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

const Alert = React.forwardRef(
  ({ className, variant = "success", title, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      duration={3000}
      className={cn(
        toastVariants({ variant }),
        "data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut",
        className
      )}
      {...props}
    >
      {variant === "destructive" ? (
        <AlertTriangle className="h-5 w-5 text-red-600" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      )}

      <div className="text-sm font-medium">{title}</div>
    </ToastPrimitive.Root>
  )
);

Alert.displayName = "Alert";

const AlertTitle = () => null;
const AlertDescription = () => null;

export { Alert, AlertTitle, AlertDescription };
