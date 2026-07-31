"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllUser, banUser, unbanUser } from "@/actions/admin.action"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import SectionCard from "@/components/dashboard/section-card"
import { UserStatusBadge } from "@/components/status-badges"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import type { User } from "@/types/api"

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    userId: string | null
    action: "ban" | "unban" | null
  }>({
    open: false,
    userId: null,
    action: null,
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUser()
        if (result?.data) {
          const userList = Array.isArray(result.data) ? result.data : []
          setUsers(userList)
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast.error("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleBanAction = async () => {
    const { userId, action } = confirmDialog
    if (!userId || !action) return

    setActionLoading(userId)
    try {
      const result =
        action === "ban" ? await banUser(userId) : await unbanUser(userId)

      if (result.success) {
        toast.success(result.message)
        setUsers(
          users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status: action === "ban" ? "BANNED" : "ACTIVE",
                }
              : u
          )
        )
      } else {
        toast.error(result.message)
      }
    } finally {
      setActionLoading(null)
      setConfirmDialog({ open: false, userId: null, action: null })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Users"
          description="Manage customers, technicians, and admins."
        />
        <SectionCard
          title="User List"
          description="Loading..."
        >
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </SectionCard>
      </div>
    )
  }

  const customerCount = users.filter((u) => u.role === "CUSTOMER").length
  const technicianCount = users.filter((u) => u.role === "TECHNICIAN").length

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage customers, technicians, and admins."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Customers" value={customerCount} />
        <StatCard label="Technicians" value={technicianCount} />
      </div>

      <SectionCard
        title="User List"
        description={`You have ${users.length} user${users.length !== 1 ? "s" : ""}`}
      >
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        User
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="break-all text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      <Info
                        label="Created"
                        value={formatDateTime(user.createdAt)}
                      />
                      <Info
                        label="Country"
                        value={user.country ?? "N/A"}
                      />
                      <Info label="Role" value={user.role} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                    <UserStatusBadge status={user.status as "ACTIVE" | "BANNED"} />

                    <Badge
                      variant={getRoleVariant(user.role)}
                      className="rounded-full px-3"
                    >
                      {user.role}
                    </Badge>

                    {user.status === "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setConfirmDialog({
                            open: true,
                            userId: user.id,
                            action: "ban",
                          })
                        }}
                        disabled={actionLoading === user.id}
                      >
                        Ban User
                      </Button>
                    )}
                    {user.status === "BANNED" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setConfirmDialog({
                            open: true,
                            userId: user.id,
                            action: "unban",
                          })
                        }}
                        disabled={actionLoading === user.id}
                      >
                        Unban User
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No users found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no registered users to display.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Ban/Unban Confirmation Dialog */}
      {confirmDialog.userId && (
        <ConfirmDialog
          title={
            confirmDialog.action === "ban"
              ? "Ban user?"
              : "Restore user access?"
          }
          description={
            confirmDialog.action === "ban"
              ? "This user will no longer be able to use protected platform functionality."
              : "The user will be able to access the platform again."
          }
          confirmText={
            confirmDialog.action === "ban" ? "Ban User" : "Unban User"
          }
          isDestructive={confirmDialog.action === "ban"}
          open={confirmDialog.open}
          onOpenChange={(open) =>
            setConfirmDialog({
              open,
              userId: open ? confirmDialog.userId : null,
              action: open ? confirmDialog.action : null,
            })
          }
          onConfirm={handleBanAction}
          loading={actionLoading === confirmDialog.userId}
        />
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}

function getRoleVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "destructive"
    case "TECHNICIAN":
      return "outline"
    case "CUSTOMER":
      return "secondary"
    default:
      return "secondary"
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString()
}
