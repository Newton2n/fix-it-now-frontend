"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, ShieldCheck, ShieldOff } from "lucide-react";

import {
  unverifyTechnician,
  verifyTechnician,
} from "@/actions/admin.action";
import { Button } from "@/components/ui/button";

type TechnicianActionsProps = {
  technicianId: string;
  verificationStatus: "PENDING" | "VERIFIED" | "UNVERIFIED";
  onSuccess?: () => void;
};

export default function TechnicianActions({
  technicianId,
  verificationStatus,
  onSuccess,
}: TechnicianActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"verify" | "unverify" | null>(null);

  const handleVerify = () => {
    setAction("verify");

    startTransition(async () => {
      try {
        const result = await verifyTechnician(technicianId);

        if (!result.success) {
          toast.error(result.message || "Failed to verify technician.");
          return;
        }

        toast.success(result.message || "Technician verified successfully.");
        onSuccess?.();
      } catch (error) {
        console.error("Verify technician error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setAction(null);
      }
    });
  };

  const handleUnverify = () => {
    setAction("unverify");

    startTransition(async () => {
      try {
        const result = await unverifyTechnician(technicianId);

        if (!result.success) {
          toast.error(result.message || "Failed to unverify technician.");
          return;
        }

        toast.success(
          result.message || "Technician unverified successfully.",
        );

        onSuccess?.();
      } catch (error) {
        console.error("Unverify technician error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setAction(null);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
      >
        <Eye className="mr-2 size-4" />
        View
      </Button>

      {verificationStatus === "PENDING" && (
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={handleVerify}
        >
          <ShieldCheck className="mr-2 size-4" />

          {action === "verify" ? "Verifying..." : "Verify"}
        </Button>
      )}

      {verificationStatus === "VERIFIED" && (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={handleUnverify}
        >
          <ShieldOff className="mr-2 size-4" />

          {action === "unverify" ? "Unverifying..." : "Unverify"}
        </Button>
      )}
    </div>
  );
}