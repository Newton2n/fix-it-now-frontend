"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllCategory, deleteCategory } from "@/actions/admin.action"
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header"
import SectionCard from "@/components/dashboard/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { CategoryForm } from "@/components/forms/category-form"
import { toast } from "sonner"
import { MoreVertical, Plus, Trash2, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Category } from "@/types/api"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory()
        if (response?.data) {
          setCategories(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast.error("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setEditDialogOpen(true)
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    const result = await deleteCategory(categoryToDelete)
    if (result.success) {
      toast.success(result.message)
      setCategories(categories.filter((c) => c.id !== categoryToDelete))
      setDeleteConfirmOpen(false)
      setCategoryToDelete(null)
    } else {
      toast.error(result.message)
    }
  }

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false)
    router.refresh()
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setSelectedCategory(null)
    router.refresh()
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Categories"
          description="Create and manage service categories."
        />
        <SectionCard
          title="Category List"
          description="Loading..."
        >
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Categories"
        description="Create and manage service categories."
        action={
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new service category to the platform
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                mode="create"
                onSuccess={handleCreateSuccess}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <SectionCard
        title="Category List"
        description={`You have ${categories.length} categor${
          categories.length !== 1 ? "ies" : "y"
        }`}
      >
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Category
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.name}
                      </h3>
                    </div>

                    {category.description && (
                      <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                        {category.description}
                      </p>
                    )}

                    <div className="grid gap-2 md:grid-cols-2">
                      <Info
                        label="Created"
                        value={formatDateTime(category.createdAt)}
                      />
                      <Info
                        label="Updated"
                        value={formatDateTime(category.updatedAt)}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    <Badge variant="secondary" className="rounded-full px-3">
                      Active
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditCategory(category)}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCategoryToDelete(category.id)
                            setDeleteConfirmOpen(true)
                          }}
                          className="gap-2 cursor-pointer text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first category to get started.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Edit Category Dialog */}
      {selectedCategory && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category information
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              mode="edit"
              initialData={selectedCategory}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        title="Delete category?"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete Category"
        cancelText="Cancel"
        isDestructive
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteCategory}
      />
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
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
