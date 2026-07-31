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
import type { TechnicianProfile } from "@/types/api";

type ActionType = "verify" | "unverify" | "suspend";

export default function TechnicianActionButtons({
  technician,
}: {
  technician?: TechnicianProfile;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<ActionType | null>(null);

  if (!technician) return null;

  const open = (nextAction: ActionType) => setAction(nextAction);
  const close = () => {
    if (pending) return;
    setAction(null);
  };

  const handleConfirm = async () => {
    if (!action) return;

    startTransition(async () => {
      const result =
        action === "verify"
          ? await verifyTechnician(technician.id)
          : action === "unverify"
          ? await unverifyTechnician(technician.id)
          : await suspendTechnician(technician.id);

      if (!result.success) {
        toast.error(result.message || "Action failed.");
        return;
      }

      toast.success(result.message);
      router.refresh();
      setAction(null);
    });
  };

  const dialogProps = {
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
  } as const;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {technician.status !== "VERIFIED" ? (
          <Button size="sm" onClick={() => open("verify")}>
            Verify
          </Button>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => open("unverify")}>
              Unverify
            </Button>
            <Button size="sm" variant="destructive" onClick={() => open("suspend")}>
              Suspend
            </Button>
          </>
        )}
      </div>

      {action ? (
        <ConfirmDialog
          open
          onOpenChange={(open) => {
            if (!open) close();
          }}
          title={dialogProps[action].title}
          description={dialogProps[action].description}
          confirmText={pending ? "Please wait..." : dialogProps[action].confirmText}
          onConfirm={handleConfirm}
          loading={pending}
          isDestructive={dialogProps[action].isDestructive}
        />
      ) : null}
    </>
  );
}