"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Download, Check } from "lucide-react";

type Cert = {
  id: string;
  certificateNumber: string;
  studentName: string;
  programName: string;
  idNumber?: string;
  issueDate: string;
  signedBy?: string;
  signatoryTitle?: string;
  qrCode?: string;
  verifyUrl?: string;
  status?: string;
  modules?: string[];
} | null;

export default function CertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const [cert, setCert] = useState<Cert>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/academy/certificate?id=${id}`)
      .then(r => r.json())
      .then(data => { if (data.ok) setCert(data.certificate); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-dark-deep"><p className="text-text-muted">Loading certificate…</p></div>;

  if (!cert) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-deep flex-col gap-4">
      <p className="text-text-muted">Certificate not found.</p>
      <Link href="/training" className="text-brand hover:underline text-sm">← Back to Academy</Link>
    </div>
  );

  const issueDate = new Date(cert.issueDate).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  const isRevoked = cert.status === "revoked";
  const modules = cert.modules || [];

  return (
    <div className="min-h-screen bg-dark-deep flex flex-col items-center justify-center p-4">
      {/* Certificate — A4 Landscape */}
      <div id="certificate" className="bg-white rounded-lg shadow-2xl relative overflow-hidden" style={{ width: "297mm", height: "210mm", maxWidth: "100%", aspectRatio: "297 / 210" }}>

        {/* Decorative border */}
        <div className="absolute inset-0 border-[3px] border-[#1e3a5f] rounded-lg" />
        <div className="absolute inset-[4px] border-2 border-[#c9a227] rounded-lg" />

        {/* Revoked stamp */}
        {isRevoked && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-red-600 font-bold text-5xl border-4 border-red-600 px-10 py-4 rotate-[-25deg] opacity-70" style={{ fontFamily: "Arial, sans-serif" }}>REVOKED</div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 py-14 text-center">

          {/* Graduation hat — top left corner, standalone, navy */}
          <div className="absolute top-8 left-10">
            <GraduationCap className="w-14 h-14 text-[#1e3a5f]" strokeWidth={1.5} />
          </div>

          {/* Company name */}
          <p className="text-[#1e3a5f] font-semibold text-[11px] tracking-[0.3em] uppercase mb-2">Ndayeni Solutions Pty Ltd</p>

          {/* Title */}
          <h1 className="text-[#1e3a5f] font-bold text-3xl sm:text-4xl mb-3" style={{ fontFamily: "Georgia, serif" }}>
            Certificate of Completion
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-14 bg-[#c9a227]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
            <div className="h-px w-14 bg-[#c9a227]" />
          </div>

          {/* Student name */}
          <p className="text-gray-400 text-xs mb-1">This is to certify that</p>
          <h2 className="text-[#1e3a5f] font-bold text-2xl sm:text-3xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
            {cert.studentName}
          </h2>
          {cert.idNumber && <p className="text-gray-500 text-xs mb-3">ID: {cert.idNumber}</p>}

          {/* Program */}
          <p className="text-gray-400 text-xs mb-1">has successfully completed</p>
          <p className="text-[#2a4a72] font-bold text-lg sm:text-xl mb-1">{cert.programName}</p>
          <p className="text-gray-400 text-xs">at Ndayeni Solutions Digital Academy</p>

          {/* Modules completed */}
          {modules.length > 0 && (
            <div className="mt-4 mb-4">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">Modules Completed</p>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
                {modules.map((m, i) => (
                  <span key={i} className="text-[10px] text-[#1e3a5f] bg-[#f0f4f8] border border-[#1e3a5f]/20 rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-[#c9a227]" />
                    {m.replace(/^\d+\.\s*/, "")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom row: signature, QR, date+cert number */}
          <div className="flex items-end justify-between w-full max-w-2xl mt-4">
            {/* Signature */}
            <div className="text-left">
              <div className="border-t-2 border-[#1e3a5f] pt-1.5 w-36">
                <p className="text-[#1e3a5f] font-semibold text-xs">{cert.signedBy || "Nhlakanipho Ntshangase"}</p>
                <p className="text-gray-400 text-[9px]">{cert.signatoryTitle || "Founder & CEO"}</p>
              </div>
            </div>

            {/* QR Code */}
            {cert.qrCode && (
              <div className="flex flex-col items-center gap-0.5">
                <img src={cert.qrCode} alt="Verify" className="w-16 h-16" />
                <p className="text-gray-400 text-[7px]">Scan to verify</p>
              </div>
            )}

            {/* Date + Cert No */}
            <div className="text-right space-y-1.5">
              <div>
                <p className="text-gray-400 text-[9px]">Date of Issue</p>
                <p className="text-[#1e3a5f] font-semibold text-xs">{issueDate}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[9px]">Certificate No.</p>
                <p className="text-[#1e3a5f] font-mono font-bold text-xs">{cert.certificateNumber}</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-gray-300 text-[7px] mt-4 max-w-md leading-relaxed">
            This certificate confirms successful completion of a Ndayeni Solutions Digital Academy training
            programme and does not constitute an NQF qualification unless otherwise stated.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-6 no-print">
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-full text-sm hover:shadow-lg transition-all">
          <Download className="w-4 h-4" /> Download / Print
        </button>
        <Link href="/training" className="text-text-muted hover:text-brand text-sm transition-colors">← Back to Academy</Link>
      </div>

      {/* Print styles — proper A4 landscape */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 297mm;
            height: 210mm;
            max-width: none;
            box-shadow: none;
            border-radius: 0;
          }
          .no-print { display: none !important; }
          @page { size: A4 landscape; margin: 0; }
          html, body { margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
}
