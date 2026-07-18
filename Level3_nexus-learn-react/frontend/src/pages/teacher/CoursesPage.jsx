import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { teacherService } from "@/services/teacherService";

const CATEGORIES = ["Web Development", "Design", "Data Science", "DevOps"];

function CreateCourseForm({ onCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState("beginner");
  const [price, setPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await teacherService.createCourse({ title, description, category, difficulty, price });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create course.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display font-semibold">New course</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="title" className="text-xs">
            Title
          </Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description" className="text-xs">
            Description
          </Label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Category</Label>
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Difficulty</Label>
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm capitalize"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {["beginner", "intermediate", "advanced"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="price" className="text-xs">
              Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Create as draft
        </Button>
      </form>
    </GlassCard>
  );
}

export default function TeacherCoursesPage() {
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["teacher", "courses"],
    queryFn: teacherService.myCourses,
  });
  const courses = data?.data?.courses || [];

  function handleCreated() {
    setShowCreate(false);
    queryClient.invalidateQueries({ queryKey: ["teacher", "courses"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">My Courses</h1>
        <Button onClick={() => setShowCreate((v) => !v)}>
          <Plus className="size-4" /> New course
        </Button>
      </div>

      {showCreate && <CreateCourseForm onCreated={handleCreated} onClose={() => setShowCreate(false)} />}

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : courses.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No courses yet. Create your first one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course._id} to={`/teacher/courses/${course._id}/edit`}>
              <GlassCard interactive className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold leading-snug">{course.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs capitalize ${
                      course.status === "published"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{course.category}</p>
                <p className="mt-auto pt-4 text-xs text-muted-foreground">
                  Manage curriculum →
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
