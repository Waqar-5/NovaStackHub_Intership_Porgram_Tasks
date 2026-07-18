import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, Send } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enrollmentService } from "@/services/enrollmentService";
import { assignmentService } from "@/services/assignmentService";

function formatDeadline(date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SubmissionForm({ assignment, onSubmitted }) {
  const [fileUrl, setFileUrl] = useState(assignment.submission?.fileUrl || "");
  const [note, setNote] = useState(assignment.submission?.note || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await assignmentService.submit({ assignmentId: assignment._id, fileUrl, note });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit. Check your link and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <div>
        <Label htmlFor={`link-${assignment._id}`} className="text-xs">
          Link to your work
        </Label>
        <Input
          id={`link-${assignment._id}`}
          type="url"
          placeholder="https://github.com/you/project"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          required
        />
      </div>
      <Input
        placeholder="Note for your teacher (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      <Button type="submit" size="sm" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {assignment.submission ? "Resubmit" : "Submit"}
      </Button>
    </form>
  );
}

export default function AssignmentsPage() {
  const queryClient = useQueryClient();

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: enrollmentService.myEnrollments,
  });
  const enrollments = enrollmentsData?.data?.enrollments || [];

  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["assignments", "by-course", enrollments.map((e) => e.course?._id)],
    queryFn: async () => {
      const results = await Promise.all(
        enrollments.map((e) => assignmentService.forCourse(e.course._id))
      );
      return results.flatMap((r, i) =>
        r.data.assignments.map((a) => ({ ...a, courseTitle: enrollments[i].course.title }))
      );
    },
    enabled: enrollments.length > 0,
  });
  const assignments = assignmentsData || [];

  const isLoading = enrollmentsLoading || assignmentsLoading;

  function handleSubmitted() {
    queryClient.invalidateQueries({ queryKey: ["assignments", "by-course"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Assignments</h1>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : assignments.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          No assignments yet — they&apos;ll show up here once you&apos;re enrolled in a
          course with one.
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <GlassCard key={assignment._id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-accent">{assignment.courseTitle}</span>
                  <h3 className="font-display font-semibold">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p>
                </div>
                <span className="glass flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  Due {formatDeadline(assignment.deadline)}
                </span>
              </div>

              {assignment.submission ? (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-success" />
                  <span className="text-muted-foreground">
                    Submitted
                    {assignment.submission.status === "graded" &&
                      ` — graded ${assignment.submission.score}/${assignment.maxScore}`}
                  </span>
                </div>
              ) : null}

              <SubmissionForm assignment={assignment} onSubmitted={handleSubmitted} />
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
