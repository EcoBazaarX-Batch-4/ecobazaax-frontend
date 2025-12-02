import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

const AlertDialog = ({ children }) => (
  <ToastPrimitive.Provider swipeDirection="right">
    {children}
    <ToastPrimitive.Viewport
      className={cn(
        "fixed top-4 right-4 z-[9999] flex flex-col gap-3 outline-none"
      )}
    />
  </ToastPrimitive.Provider>
);

const AlertDialogTrigger = () => null;
const AlertDialogPortal = () => null;
const AlertDialogOverlay = () => null;

const AlertDialogContent = ({ children }) => <>{children}</>;
const AlertDialogHeader = ({ children }) => <>{children}</>;
const AlertDialogFooter = ({ children }) => <>{children}</>;
const AlertDialogTitle = ({ children }) => <>{children}</>;
const AlertDialogDescription = ({ children }) => <>{children}</>;
const AlertDialogAction = ({ children }) => <>{children}</>;
const AlertDialogCancel = ({ children }) => <>{children}</>;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
