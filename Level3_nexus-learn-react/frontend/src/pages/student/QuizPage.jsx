import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { quizService } from "@/services/quizService";
import { cn } from "@/lib/utils";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuizPage() {
  const { id } = useParams();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const hasSubmittedRef = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizService.get(id),
  });
  const quiz = data?.data?.quiz;
  const priorAttempt = data?.data?.priorAttempt;

  useEffect(() => {
    if (!quiz || secondsLeft !== null) return;
    const t = setTimeout(() => setSecondsLeft(quiz.timerSeconds), 0);
    return () => clearTimeout(t);
  }, [quiz, secondsLeft]);

  const submit = useMemo(
    () =>
      async function submit(autoSubmitted) {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        setSubmitting(true);
        try {
          const payload = Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          }));
          const res = await quizService.submit(id, payload, autoSubmitted);
          setResult(res.data.attempt);
        } finally {
          setSubmitting(false);
        }
      },
    [answers, id]
  );

  useEffect(() => {
    if (secondsLeft === null || result || priorAttempt) return;
    if (secondsLeft <= 0) {
      submit(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, result, priorAttempt, submit]);

  if (isLoading) {
    return <Loader2 className="mx-auto mt-20 size-8 animate-spin text-muted-foreground" />;
  }

  if (!quiz) {
    return (
      <div className="glass mx-auto mt-10 max-w-lg rounded-lg p-10 text-center text-sm text-muted-foreground">
        Quiz not found.
      </div>
    );
  }

  const finalAttempt = result || priorAttempt;

  if (finalAttempt) {
    return (
      <div className="mx-auto max-w-lg">
        <GlassCard className="text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" />
          <h1 className="mt-3 font-display text-2xl font-bold">Quiz complete</h1>
          <p className="mt-2 text-muted-foreground">
            You scored{" "}
            <span className="font-semibold text-foreground">
              {finalAttempt.score} / {finalAttempt.totalPoints}
            </span>
          </p>
          {finalAttempt.autoSubmitted && (
            <p className="mt-1 text-xs text-warning">Auto-submitted when time ran out.</p>
          )}
        </GlassCard>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q._id]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{quiz.title}</h1>
        <span
          className={cn(
            "glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-mono",
            secondsLeft <= 30 && "text-danger"
          )}
        >
          <Clock className="size-4" />
          {secondsLeft !== null ? formatTime(secondsLeft) : "--:--"}
        </span>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, i) => (
          <GlassCard key={q._id}>
            <p className="font-medium">
              {i + 1}. {q.text}
            </p>
            <div className="mt-3 space-y-2">
              {(q.type === "short" ? null : q.options)?.map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm",
                    "has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  )}
                >
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() => setAnswers((a) => ({ ...a, [q._id]: option }))}
                  />
                  {option}
                </label>
              ))}
              {q.type === "short" && (
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus-visible:border-accent"
                  value={answers[q._id] || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q._id]: e.target.value }))}
                  placeholder="Your answer"
                />
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <Button
        className="w-full"
        disabled={!allAnswered || submitting}
        onClick={() => submit(false)}
      >
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Submit quiz
      </Button>
    </div>
  );
}
