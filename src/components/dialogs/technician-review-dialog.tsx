"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { TechnicianVerificationBadge } from "@/components/status-badges"
import { verifyTechnician, unverifyTechnician } from "@/actions/admin.action"
import { toast } from "sonner"
import type { TechnicianProfile } from "@/types/technician"

interface TechnicianReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  technician: TechnicianProfile | null
  onVerifySuccess?: () => void
}

export function TechnicianReviewDialog({
  open,
  onOpenChange,
  technician,
  onVerifySuccess,
}: TechnicianReviewDialogProps) {
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [unverifyDialogOpen, setUnverifyDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!technician) return null

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      const result = await verifyTechnician(technician.userId)
      if (result.success) {
        toast.success(result.message)
        setVerifyDialogOpen(false)
        onVerifySuccess?.()
      } else {
        toast.error(result.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnverify = async () => {
    setIsLoading(true)
    try {
      const result = await unverifyTechnician(technician.userId)
      if (result.success) {
        toast.success(result.message)
        setUnverifyDialogOpen(false)
        onVerifySuccess?.()
      } else {
        toast.error(result.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Technician Profile Review</DialogTitle>
            <DialogDescription>
              Review and verify technician information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Verification Status */}
            <div>
              <h3 className="font-semibold mb-2">Verification Status</h3>
              <TechnicianVerificationBadge status={technician.status} />
            </div>

            {/* Profile Information */}
            <div>
              <h3 className="font-semibold mb-3">Profile Information</h3>
              <div className="space-y-3">
                <InfoItem label="User ID" value={technician.userId} />
                <InfoItem label="Bio" value={technician.bio} />
                <InfoItem
                  label="Skills"
                  value={technician.skills?.join(", ") || "N/A"}
                />
                <InfoItem label="Experience" value={String(technician.yearsOfExperience)} />
                
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              {technician.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setUnverifyDialogOpen(true)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => setVerifyDialogOpen(true)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Verify
                  </Button>
                </>
              )}
              {technician.status === "VERIFIED" && (
                <Button
                  variant="destructive"
                  onClick={() => setUnverifyDialogOpen(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  Remove Verification
                </Button>
              )}
              {technician.status === "SUSPENDED" && (
                <Button
                  onClick={() => setVerifyDialogOpen(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  Contact support
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Verify Confirmation Dialog */}
      <ConfirmDialog
        title="Verify technician?"
        description="This technician will become eligible to provide services on the platform."
        confirmText="Verify Technician"
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        onConfirm={handleVerify}
        loading={isLoading}
      />

      {/* Unverify Confirmation Dialog */}
      <ConfirmDialog
        title="Remove verification?"
        description="This technician will no longer be treated as a verified technician."
        confirmText="Remove Verification"
        isDestructive
        open={unverifyDialogOpen}
        onOpenChange={setUnverifyDialogOpen}
        onConfirm={handleUnverify}
        loading={isLoading}
      />
    </>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold break-words text-right max-w-xs">
        {value}
      </span>
    </div>
  )
}
