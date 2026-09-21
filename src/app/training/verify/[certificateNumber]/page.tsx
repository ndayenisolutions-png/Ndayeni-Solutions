"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  const params = useParams();
  const certNumber = params.certificateNumber as string;
  const [cert, setCert] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  useEffect(() => {
    fetch(`/api/academy/certificate?certificateNumber=${encodeURIComponent(certNumber)}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setCert(data.certificate);
          setFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [certNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep">
        <p className="text-text-muted">Verifying certificate…</p>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep px-4">
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center border-red-500/30">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-warm-white font-bold text-xl mb-2">Certificate Not Found</h1>
          <p className="text-text-muted text-sm mb-6">
            No certificate was found with the number <span className="font-mono text-warm-white">{certNumber}</span>.
            Please check the number and try again, or contact Ndayeni Solutions for assistance.
          </p>
          <Link href="/training" className="text-brand hover:underline text-sm">← Back to Academy</Link>
        </div>
      </div>
    );
  }

  const isRevoked = cert?.status === "revoked";
  const issueDate = cert?.issueDate ? new Date(cert.issueDate as string).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-deep px-4">
      <div className={`glass-strong rounded-2xl p-6 sm:p-8 max-w-md w-full text-center ${isRevoked ? "border-red-500/30" : "border-brand/20"}`}>
        {isRevoked ? (
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        ) : (
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        )}

        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span className="text-text-muted text-xs">Ndayeni Solutions Digital Academy</span>
        </div>

        <h1 className={`font-bold text-xl sm:text-2xl mb-2 ${isRevoked ? "text-red-400" : "text-warm-white"}`}>
          {isRevoked ? "Certificate Revoked" : "Certificate Verified"}
        </h1>

        <p className="text-text-muted text-sm mb-6">
          {isRevoked
            ? "This certificate has been revoked and is no longer valid."
            : "This certificate has been verified as authentic and valid."}
        </p>

        <div className="glass rounded-xl p-4 border-brand/10 text-left space-y-2 mb-6">
          <div className="flex justify-between gap-2"><span className="text-text-muted text-xs">Certificate No:</span><span className="text-warm-white font-mono text-xs font-bold">{String(cert?.certificateNumber || "—")}</span></div>
          <div className="flex justify-between gap-2"><span className="text-text-muted text-xs">Student:</span><span className="text-warm-white text-xs font-medium">{String(cert?.studentName || "—")}</span></div>
          {cert?.idNumber && <div className="flex justify-between gap-2"><span className="text-text-muted text-xs">ID Number:</span><span className="text-warm-white text-xs">{String(cert.idNumber)}</span></div>}
          <div className="flex justify-between gap-2"><span className="text-text-muted text-xs">Programme:</span><span className="text-warm-white text-xs font-medium">{String(cert?.programName || "—")}</span></div>
          <div className="flex justify-between gap-2"><span className="text-text-muted text-xs">Issue Date:</span><span className="text-warm-white text-xs">{issueDate}</span></div>
          <div className="flex justify-between gap-2"><span className="text-text-muted text-xs">Status:</span><span className={`text-xs font-bold uppercase ${isRevoked ? "text-red-400" : "text-green-400"}`}>{isRevoked ? "Revoked" : "Valid"}</span></div>
        </div>

        <Link href="/training" className="text-brand hover:underline text-sm">← Back to Academy</Link>
      </div>
    </div>
  );
}
