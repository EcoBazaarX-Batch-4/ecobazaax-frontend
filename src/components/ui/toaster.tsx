"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import { CheckCircle2 } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="up" duration={3000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="mx-auto flex items-center gap-4 bg-green-100 border border-green-300 text-green-800 shadow-lg rounded-xl py-4 px-6 max-w-[400px]"
          >
            {/* ICON */}
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />

            {/* TEXT AREA — title + description perfectly aligned beside icon */}
            <div className="flex flex-col leading-tight">
              {title && (
                <ToastTitle className="font-semibold text-green-800">
                  {title}
                </ToastTitle>
              )}

              {description && (
                <ToastDescription className="text-green-700 text-sm">
                  {description}
                </ToastDescription>
              )}
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}

      {/* TOP-CENTER POSITION */}
      <ToastViewport className="fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-[9999]" />
    </ToastProvider>
  );
}
