import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { attendanceService } from "@/services/attendanceService";
import { cn } from "@/lib/utils";

const STATUS_COLOR = {
  present: "text-success",
  absent: "text-danger",
  late: "text-warning",
  leave: "text-muted-foreground",
};

export default function AttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["attendance", "me"],
    queryFn: () => attendanceService.mine(),
  });
  const records = data?.data?.records || [];
  const summary = data?.data?.summary;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Attendance</h1>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : (
        <>
          {summary && summary.total > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {["present", "absent", "late", "leave"].map((key) => (
                <GlassCard key={key} className="text-center">
                  <p className={cn("font-display text-2xl font-bold", STATUS_COLOR[key])}>
                    {summary[key]}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">{key}</p>
                </GlassCard>
              ))}
            </div>
          )}

          {records.length === 0 ? (
            <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
              No attendance records yet — your teacher marks these per class.
            </div>
          ) : (
            <GlassCard className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{r.course?.title}</td>
                      <td className={cn("px-4 py-3 capitalize", STATUS_COLOR[r.status])}>
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
