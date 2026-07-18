import { useQuery } from "@tanstack/react-query";
import { Award, Loader2, Copy } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { certificateService } from "@/services/certificateService";

function CertificateCard({ certificate }) {
  return (
    <GlassCard interactive>
      <Award className="size-8 text-warning" />
      <h3 className="mt-3 font-display font-semibold">{certificate.course?.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Issued {new Date(certificate.issuedAt).toLocaleDateString()}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(certificate.certificateId)}
        className="mt-3 flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary"
        title="Copy certificate ID"
      >
        <Copy className="size-3" />
        {certificate.certificateId}
      </button>
    </GlassCard>
  );
}

export default function CertificatesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["certificates", "me"],
    queryFn: certificateService.mine,
  });
  const certificates = data?.data?.certificates || [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Certificates</h1>

      {isLoading ? (
        <Loader2 className="mx-auto mt-10 size-6 animate-spin text-muted-foreground" />
      ) : certificates.length === 0 ? (
        <div className="glass rounded-lg p-10 text-center text-sm text-muted-foreground">
          Complete a course to earn your first certificate.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <CertificateCard key={c._id} certificate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
