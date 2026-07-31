
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Ban, ShieldCheck, Loader2 } from "lucide-react";

import { banUser, unbanUser } from "@/actions/admin.action";
import { Button } from "@/components/ui/button";
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

type UserStatus = "ACTIVE" | "BANNED" | "INACTIVE";

type UserActionsProps = {
  userId: string;
  status: UserStatus;
};

export default function UserActions({
  userId,
  status,
}: UserActionsProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isBanned = status === "BANNED";

  const handleStatusChange = () => {
    startTransition(async () => {
      const result = isBanned
        ? await unbanUser(userId)
        : await banUser(userId);

      if (!result.success) {
        console.error(result.message);
        return;
      }

      setDialogOpen(false);

      router.refresh();
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          type="button"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>

        {status !== "INACTIVE" && (
          <Button
            size="sm"
            variant={isBanned ? "outline" : "destructive"}
            type="button"
            disabled={isPending}
            onClick={() => setDialogOpen(true)}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isBanned ? (
              <ShieldCheck className="mr-2 h-4 w-4" />
            ) : (
              <Ban className="mr-2 h-4 w-4" />
            )}

            {isBanned ? "Unban" : "Ban"}
          </Button>
        )}
      </div>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isBanned
                ? "Unban this user?"
                : "Ban this user?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {isBanned
                ? "This user will be able to use the platform again."
                : "This user will no longer be able to use the platform normally."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleStatusChange();
              }}
              disabled={isPending}
              className={
                isBanned
                  ? undefined
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }
            >
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {isBanned ? "Unban User" : "Ban User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

