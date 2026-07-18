import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ExternalLink, Send } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { teacherService } from "@/services/teacherService";

function GradeForm({ submission, onGraded }) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await teacherService.gradeSubmission(submission._id, { score: Number(score), feedback });
      onGraded();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit grade.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-2">
      <div className="w-24">
        <label className="text-xs text-muted-foreground">Score / {submission.maxScore}</label>
        <Input
          type="number"
          min="0"
          max={submission.maxScore}
          value={score}
          onChange={(e) => setScore(e.target.value)}
          required
        />
      </div>
      <Input
        placeholder="Feedback (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="min-w-[200px] flex-1"
      />
      {error && <p className="w-full text-xs text-danger">{error}</p>}
      <Button type="submit" size="sm" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Submit grade
      </Button>
    </form>
  );
}

export default function GradingPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["teacher", "submissions", "pending"],
    queryFn: teacherService.pendingSubmissions,
  });
  const submissions = data?.data?.submissions || [];

  function handleGraded() {
    queryClient.invalidateQueries({ queryKey: ["teacher", "submissions", "pending"] });
    queryClient.invalidateQueries({ queryKey: ["teacher", "overview"] });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Grading queue</h1>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : submissions.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          Nothing to grade right now.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <GlassCard key={s._id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-accent">{s.courseTitle}</span>
                  <h3 className="font-display font-semibold">{s.assignmentTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted by {s.student?.name} on{" "}
                    {new Date(s.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View submission <ExternalLink className="size-3" />
                </a>
              </div>
              {s.note && <p className="mt-2 text-sm text-muted-foreground">Note: {s.note}</p>}
              <GradeForm submission={s} onGraded={handleGraded} />
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
