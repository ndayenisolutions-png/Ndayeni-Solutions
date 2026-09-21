"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Award, Download } from "lucide-react";

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
} | null;

export default function CertificatePage() {
  const params = useParams();
  const id = params.id as string;
  const [cert, setCert] = useState<Cert>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/academy/certificate?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setCert(data.certificate);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-deep"><p className="text-text-muted">Loading certificate…</p></div>;
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-deep flex-col gap-4">
        <p className="text-text-muted">Certificate not found.</p>
        <Link href="/training" className="text-brand hover:underline text-sm">← Back to Academy</Link>
      </div>
    );
  }

  const issueDate = new Date(cert.issueDate).toLocaleDateString("en-ZA", {
    year: "numeric", month: "long", day: "numeric",
  });

  const isRevoked = cert.status === "revoked";

  return (
    <div className="min-h-screen bg-dark-deep flex flex-col items-center justify-center p-4">
      {/* Certificate — A4 Landscape orientation */}
      <div id="certificate" className="bg-white rounded-lg shadow-2xl relative overflow-hidden max-w-4xl w-full" style={{ aspectRatio: "297 / 210" }}>
        {/* Decorative border */}
        <div className="absolute inset-3 sm:inset-5 border-2 border-double border-slate-800 rounded-lg" />

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10">
          <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" />
        </div>
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10">
          <Award className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" />
        </div>

        {/* Revoked stamp */}
        {isRevoked && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-red-600 font-bold text-4xl sm:text-5xl border-4 border-red-600 px-8 py-4 rotate-[-25deg] opacity-80" style={{ fontFamily: "Arial, sans-serif" }}>
              REVOKED
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex h-full p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col items-center justify-center w-full text-center">
            {/* Header */}
            <p className="text-slate-700 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-1">Ndayeni Solutions Pty Ltd</p>
            <h1 className="text-slate-800 font-bold text-2xl sm:text-3xl lg:text-4xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Certificate of Completion
            </h1>
            <div className="w-24 sm:w-32 h-px bg-slate-700 my-3 sm:my-5" />

            {/* Student name */}
            <p className="text-gray-500 text-xs sm:text-sm mb-2">This certifies that</p>
            <h2 className="text-slate-800 font-bold text-xl sm:text-2xl lg:text-3xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
              {cert.studentName}
            </h2>
            {cert.idNumber && (
              <p className="text-gray-500 text-xs sm:text-sm mb-3">ID Number: {cert.idNumber}</p>
            )}

            {/* Program */}
            <p className="text-gray-500 text-xs sm:text-sm mb-1">has successfully completed the</p>
            <p className="text-slate-700 font-semibold text-base sm:text-lg lg:text-xl mb-2">
              {cert.programName}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">training programme offered by</p>
            <p className="text-slate-700 font-semibold text-sm sm:text-base mb-4 sm:mb-6">Ndayeni Solutions Digital Academy</p>

            {/* Bottom row: signature, cert number, QR, date */}
            <div className="flex items-end justify-between w-full max-w-lg mt-2 sm:mt-4">
              {/* Signature */}
              <div className="text-left">
                <div className="border-t border-gray-500 pt-1 w-28 sm:w-36">
                  <p className="text-slate-800 font-semibold text-[10px] sm:text-xs">{cert.signedBy || "Nhlakanipho Ntshangase"}</p>
                  <p className="text-gray-500 text-[8px] sm:text-[10px]">{cert.signatoryTitle || "Founder & CEO"}</p>
                </div>
              </div>

              {/* QR Code */}
              {cert.qrCode && (
                <div className="flex flex-col items-center gap-1">
                  <img src={cert.qrCode} alt="QR Code for verification" className="w-16 h-16 sm:w-20 sm:h-20" />
                  <p className="text-gray-400 text-[7px] sm:text-[8px]">Scan to verify</p>
                </div>
              )}

              {/* Date + Cert No */}
              <div className="text-right space-y-2">
                <div>
                  <p className="text-gray-500 text-[8px] sm:text-[10px]">Date of Issue</p>
                  <p className="text-slate-800 font-semibold text-[10px] sm:text-xs">{issueDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[8px] sm:text-[10px]">Certificate No.</p>
                  <p className="text-slate-800 font-mono font-semibold text-[10px] sm:text-xs">{cert.certificateNumber}</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-gray-400 text-[7px] sm:text-[8px] mt-4 sm:mt-6 max-w-md leading-relaxed">
              This certificate confirms successful completion of a Ndayeni Solutions Digital Academy training
              programme and does not constitute an NQF qualification unless otherwise stated.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light text-dark-deep font-semibold px-6 py-3 rounded-full text-sm hover:shadow-lg transition-all"
        >
          <Download className="w-4 h-4" /> Download / Print
        </button>
        <Link href="/training" className="text-text-muted hover:text-brand text-sm transition-colors">
          ← Back to Academy
        </Link>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
          button, a { display: none !important; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
