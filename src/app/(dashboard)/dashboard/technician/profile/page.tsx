"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import SectionCard from "@/components/dashboard/section-card"
import { TechnicianVerificationBadge } from "@/components/status-badges"
import { TechnicianProfileForm } from "@/components/forms/technician-profile-form"
import { getLoginTechnicianProfile } from "@/actions/technician.action"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { TechnicianProfile } from "@/types/api"

export default function TechnicianProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<TechnicianProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getLoginTechnicianProfile()
        if (result.success && result.data) {
          setProfile(result.data)
        } else {
          setError(result.message)
        }
      } catch (err) {
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Profile"
        description="Update your professional information and manage your technician profile."
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <SectionCard
          title="Profile Details"
          description="Edit your technician profile"
        >
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </SectionCard>
      ) : profile ? (
        <>
          <SectionCard
            title="Verification Status"
            description="Your current profile verification status"
          >
            <div className="space-y-3">
              <div>
                <TechnicianVerificationBadge status={profile.status} />
              </div>
              {profile.status === "PENDING" && (
                <p className="text-sm text-muted-foreground">
                  Your profile has been submitted and is waiting for admin verification.
                </p>
              )}
              {profile.status === "VERIFIED" && (
                <p className="text-sm text-muted-foreground">
                  Your profile is verified and visible to customers.
                </p>
              )}
              {profile.status === "SUSPENDED" && (
                <p className="text-sm text-muted-foreground">
                  Your profile is suspended.
                </p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Profile Details"
            description="Edit your professional information"
          >
            <TechnicianProfileForm
              mode="edit"
              initialData={profile}
              onSuccess={handleSuccess}
            />
          </SectionCard>
        </>
      ) : (
        <SectionCard
          title="Create Your Profile"
          description="Set up your professional profile to start receiving bookings"
        >
          <TechnicianProfileForm
            mode="create"
            onSuccess={handleSuccess}
          />
        </SectionCard>
      )}
    </div>
  )
}
