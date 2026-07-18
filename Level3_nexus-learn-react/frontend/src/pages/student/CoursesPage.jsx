import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/shared/course-card";
import { EnrolledCourseCard } from "@/components/shared/enrolled-course-card";
import { courseService } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";

const CATEGORIES = ["Web Development", "Design", "Data Science", "DevOps"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

function MyCoursesTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: enrollmentService.myEnrollments,
  });

  const enrollments = data?.data?.enrollments || [];

  if (isLoading) {
    return <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />;
  }

  if (enrollments.length === 0) {
    return (
      <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
        You haven&apos;t enrolled in any courses yet. Switch to Browse to find one.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {enrollments.map((e) => (
        <EnrolledCourseCard key={e._id} enrollment={e} />
      ))}
    </div>
  );
}

function BrowseTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { search, category, difficulty }],
    queryFn: () =>
      courseService.list({
        search: search || undefined,
        category: category || undefined,
        difficulty: difficulty || undefined,
        limit: 24,
      }),
  });

  const courses = data?.data?.courses || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="glass rounded-md px-3 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="glass rounded-md px-3 py-2 text-sm capitalize"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All levels</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d} className="capitalize">
              {d}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : courses.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No courses match those filters yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Courses</h1>

      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">My Courses</TabsTrigger>
          <TabsTrigger value="browse">Browse Catalog</TabsTrigger>
        </TabsList>
        <TabsContent value="mine">
          <MyCoursesTab />
        </TabsContent>
        <TabsContent value="browse">
          <BrowseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
