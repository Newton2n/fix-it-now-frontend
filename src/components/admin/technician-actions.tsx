"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import {
  verifyTechnician,
  unverifyTechnician,
  suspendTechnician,
} from "@/actions/admin.action";
import type { TechnicianProfile } from "@/types/technician";

type ActionType = "verify" | "unverify" | "suspend";

const actionConfig: Record<
  ActionType,
  {
    title: string;
    description: string;
    confirmText: string;
    isDestructive: boolean;
  }
> = {
  verify: {
    title: "Verify technician?",
    description: "This will mark the technician as verified.",
    confirmText: "Verify",
    isDestructive: false,
  },
  unverify: {
    title: "Unverify technician?",
    description: "This will remove the verified status from this technician.",
    confirmText: "Unverify",
    isDestructive: true,
  },
  suspend: {
    title: "Suspend technician?",
    description: "This will suspend the technician account.",
    confirmText: "Suspend",
    isDestructive: true,
  },
};

export default function TechnicianActionButtons({
  technician,
}: {
  technician?: TechnicianProfile;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

  if (!technician) return null;

  const openDialog = (action: ActionType) => {
    setSelectedAction(action);
  };

  const closeDialog = () => {
    if (isPending) return;
    setSelectedAction(null);
  };

  const handleConfirm = () => {
    if (!selectedAction) return;

    startTransition(async () => {
      let result;

      if (selectedAction === "verify") {
        result = await verifyTechnician(technician.id);
      } else if (selectedAction === "unverify") {
        result = await unverifyTechnician(technician.id);
      } else {
        result = await suspendTechnician(technician.id);
      }

      if (!result.success) {
        toast.error(result.message || "Action failed.");
        return;
      }

      toast.success(result.message);
      router.refresh();
      setSelectedAction(null);
    });
  };

  const currentConfig = selectedAction ? actionConfig[selectedAction] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {technician.status !== "VERIFIED" ? (
          <Button size="sm" onClick={() => openDialog("verify")}>
            Verify
          </Button>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => openDialog("unverify")}>
              Unverify
            </Button>
            <Button size="sm" variant="destructive" onClick={() => openDialog("suspend")}>
              Suspend
            </Button>
          </>
        )}
      </div>

      {currentConfig && (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            if (!open) closeDialog();
          }}
          title={currentConfig.title}
          description={currentConfig.description}
          confirmText={isPending ? "Please wait..." : currentConfig.confirmText}
          onConfirm={handleConfirm}
          loading={isPending}
          isDestructive={currentConfig.isDestructive}
        />
      )}
    </>
  );
}