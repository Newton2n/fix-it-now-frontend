// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MoreVertical, Plus, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

import { getAllCategory, deleteCategory } from "@/actions/admin.action";
import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { CategoryForm } from "@/components/forms/category-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/category";

import CategoriesFilterBar from "@/components/dashboard/filters/admin/categories-filter-bar";

type CategoryResult = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Category[];
};

export default function AdminCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [meta, setMeta] = useState<CategoryResult["meta"]>({
    currentPage: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Derive query from URL on each render
  const query = {
    search: searchParams.get("search") || undefined,
    page: searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1,
    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 10,
    sortBy: (searchParams.get("sortBy") as "name" | "createdAt" | null) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc" | null) || "desc",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategory(query);

        if (!response.success) {
          toast.error(response.message || "Failed to load categories");
          setCategories([]);
          setMeta({
            currentPage: 1,
            limit: 10,
            totalRow: 0,
            totalPage: 0,
          });
          return;
        }

        const categoryResult: CategoryResult = response.data ?? {
          meta: {
            currentPage: 1,
            limit: 10,
            totalRow: 0,
            totalPage: 0,
          },
          data: [],
        };

        setCategories(categoryResult.data);
        setMeta(categoryResult.meta);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [searchParams]); // re-run when URL changes

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteCategory(categoryToDelete);

      if (result.success) {
        toast.success(result.message || "Category deleted successfully");
        setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete));
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("An error occurred while deleting the category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    router.refresh();
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedCategory(null);
    router.refresh();
  };

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
              <CategoryForm mode="create" onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters + pagination */}
      <CategoriesFilterBar
        currentPage={meta.currentPage}
        totalPage={meta.totalPage}
      />

      <SectionCard
        title="Category List"
        description={
          loading
            ? "Loading categories..."
            : `Page ${meta.currentPage} of ${meta.totalPage} • ${meta.totalRow} total`
        }
      >
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-3 pr-10 lg:pr-0">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Category
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.name}
                      </h3>
                    </div>

                    {category.description ? (
                      <p className="max-w-3xl whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                        {category.description}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No description added.
                      </p>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2 lg:max-w-2xl">
                      <Info
                        label="Created"
                        value={formatDateTime(category.createdAt)}
                      />
                      <Info
                        label="Updated"
                        value={formatDateTime(category.updatedAt)}
                      />
                    </div>

                    <div className="pt-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/categories/${category.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View services
                        </Link>
                      </Button>
                    </div>

                    <p className="text-xs text-amber-600">
                      You can’t delete this category if it already has services.
                    </p>
                  </div>

                  <div className="absolute right-0 top-0 flex shrink-0 flex-col items-end gap-3 lg:static lg:items-end">
                    <Badge variant="secondary" className="rounded-full px-3">
                      Active
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditCategory(category)}
                          className="cursor-pointer gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCategoryToDelete(category.id);
                            setDeleteConfirmOpen(true);
                          }}
                          className="cursor-pointer gap-2 text-destructive"
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

      <ConfirmDialog
        title="Delete category?"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete Category"}
        cancelText="Cancel"
        isDestructive
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteCategory}
      />
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

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString();
}