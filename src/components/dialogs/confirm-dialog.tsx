"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ConfirmDialogProps {
  title: string
  description?: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  loading?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  children?: React.ReactNode
  isDestructive?: boolean
}

export function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  open,
  onOpenChange,
  onConfirm,
  children,
  isDestructive = false,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const handleConfirm = async () => {
    await onConfirm()
    handleOpenChange(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant={isDestructive ? "destructive" : variant}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
