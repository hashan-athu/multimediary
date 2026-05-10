"use client";

import { useState, cloneElement, isValidElement, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void;
  children: ReactNode;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  variant = "default",
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const trigger = isValidElement<{ onClick?: React.MouseEventHandler }>(children)
    ? cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          setOpen(true);
        },
      })
    : children;

  return (
    <>
      {trigger}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-xl border-none shadow-xl bg-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#1C2238]">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#4F5C72]">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-lg bg-[#EDF1F7] border-none text-[#4F5C72] font-semibold hover:bg-[#E0E8EF]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onConfirm(); setOpen(false); }}
              className={cn(
                "rounded-lg font-semibold px-6",
                variant === "destructive"
                  ? "bg-[#F25959] hover:bg-[#D94E4E] text-white"
                  : "bg-[#4299EB] hover:bg-[#3182CE] text-white"
              )}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
