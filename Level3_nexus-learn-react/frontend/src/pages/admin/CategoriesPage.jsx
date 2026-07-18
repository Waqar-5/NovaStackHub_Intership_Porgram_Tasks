import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryService } from "@/services/categoryService";
import { adminService } from "@/services/adminService";

export default function AdminCategoriesPage() {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.list,
  });
  const categories = data?.data?.categories || [];

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await adminService.createCategory({ name });
      setName("");
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create category.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    await adminService.deleteCategory(id);
    refresh();
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Categories</h1>

      <GlassCard>
        <form onSubmit={handleCreate} className="flex gap-2">
          <Input
            placeholder="New category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add
          </Button>
        </form>
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </GlassCard>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : categories.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No categories yet.
        </div>
      ) : (
        <GlassCard className="divide-y divide-border p-0">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm">{cat.name}</span>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-muted-foreground hover:text-danger"
                aria-label={`Delete ${cat.name}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </GlassCard>
      )}
    </div>
  );
}
