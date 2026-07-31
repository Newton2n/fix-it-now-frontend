"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllTechnicianProfile } from "@/actions/admin.action"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import SectionCard from "@/components/dashboard/section-card"
import { TechnicianReviewDialog } from "@/components/dialogs/technician-review-dialog"
import { TechnicianVerificationBadge } from "@/components/status-badges"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { TechnicianProfile } from "@/types/api"

export default function AdminTechniciansPage() {
  const router = useRouter()
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianProfile | null>(null)

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const result = await getAllTechnicianProfile()
        if (result?.data) {
          const techList = Array.isArray(result.data) ? result.data : []
          setTechnicians(techList)
        }
      } catch (error) {
        console.error("Failed to fetch technicians:", error)
        toast.error("Failed to load technicians")
      } finally {
        setLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  const handleReviewTechnician = (tech: TechnicianProfile) => {
    setSelectedTechnician(tech)
    setReviewDialogOpen(true)
  }

  const handleVerifySuccess = () => {
    setReviewDialogOpen(false)
    router.refresh()
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Technicians"
          description="Review and manage technician profiles."
        />
        <SectionCard
          title="Technician List"
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

  const verifiedCount = technicians.filter((t) => t.verificationStatus === "VERIFIED").length
  const pendingCount = technicians.filter((t) => t.verificationStatus === "PENDING").length

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Technicians"
        description="Review and manage technician profiles."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Technicians" value={technicians.length} />
        <StatCard label="Verified" value={verifiedCount} />
        <StatCard label="Pending Review" value={pendingCount} />
      </div>

      <SectionCard
        title="Technician List"
        description={`You have ${technicians.length} technician${technicians.length !== 1 ? "s" : ""}`}
      >
        {technicians.length > 0 ? (
          <div className="space-y-4">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-sm text-muted-foreground">Technician</p>
                      <h3 className="text-lg font-semibold">{tech.bio.slice(0, 40)}</h3>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info
                        label="User ID"
                        value={tech.userId.slice(0, 8)}
                      />
                      <Info
                        label="Experience"
                        value={tech.experience}
                      />
                      <Info
                        label="Created"
                        value={formatDateTime(tech.createdAt)}
                      />
                      <Info
                        label="Skills"
                        value={tech.skills?.join(", ") || "N/A"}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <TechnicianVerificationBadge status={tech.verificationStatus} />
                    {tech.verificationStatus === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => handleReviewTechnician(tech)}
                      >
                        Review
                      </Button>
                    )}
                    {tech.verificationStatus === "VERIFIED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewTechnician(tech)}
                      >
                        View
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
              No technicians found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no technicians to display.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Technician Review Dialog */}
      {selectedTechnician && (
        <TechnicianReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          technician={selectedTechnician}
          onVerifySuccess={handleVerifySuccess}
        />
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium leading-6 text-foreground">
        {value}
      </p>
    </div>
  )
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString()
}
