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
    return <div className="min-h-screen flex items-center justify-center bg-dark-deep"><p className="text-text-muted">Loading certificate...</p></div>;
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

  return (
    <div className="min-h-screen bg-dark-deep flex flex-col items-center justify-center p-4">
      {/* Certificate — A4 Landscape orientation */}
      <div id="certificate" className="bg-white rounded-lg shadow-2xl p-8 sm:p-10 lg:p-12 max-w-4xl w-full relative overflow-hidden" style={{ aspectRatio: "297 / 210" }}>
        {/* Decorative border */}
        <div className="absolute inset-2 sm:inset-4 border-2 sm:border-4 border-double border-blue-900 rounded-lg" />

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-blue-900" />
        </div>
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <Award className="w-8 h-8 sm:w-12 sm:h-12 text-blue-900" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <p className="text-blue-900 font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase mb-1">Ndayeni Solutions Pty Ltd</p>
          <h1 className="text-blue-900 font-bold text-2xl sm:text-3xl lg:text-4xl mb-1" style={{ fontFamily: "Georgia, serif" }}>
            Certificate of Completion
          </h1>
          <div className="w-24 sm:w-32 h-px bg-blue-900 my-4 sm:my-6" />
          <p className="text-gray-600 text-xs sm:text-sm mb-2">This certifies that</p>
          <h2 className="text-blue-900 font-bold text-xl sm:text-2xl lg:text-3xl mb-2" style={{ fontFamily: "Georgia, serif" }}>
            {cert.studentName}
          </h2>
          {cert.idNumber && (
            <p className="text-gray-500 text-xs sm:text-sm mb-2">ID Number: {cert.idNumber}</p>
          )}
          <p className="text-gray-600 text-xs sm:text-sm mb-2">has successfully completed the</p>
          <p className="text-blue-900 font-semibold text-base sm:text-lg lg:text-xl mb-6">
            {cert.programName}
          </p>
          <p className="text-gray-600 text-xs sm:text-sm">training program offered by</p>
          <p className="text-blue-900 font-semibold text-sm sm:text-base mb-8">Ndayeni Solutions Digital Academy</p>

          {/* Bottom row */}
          <div className="flex items-end justify-between w-full max-w-md mt-4">
            <div className="text-left">
              <div className="border-t border-gray-400 pt-1 w-32 sm:w-40">
                <p className="text-blue-900 font-semibold text-[10px] sm:text-xs">{cert.signedBy || "Nhlakanipho Ntshangase"}</p>
                <p className="text-gray-500 text-[8px] sm:text-[10px]">Founder & CEO</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-[8px] sm:text-[10px] mb-1">Certificate No.</p>
              <p className="text-blue-900 font-mono font-semibold text-[10px] sm:text-xs">{cert.certificateNumber}</p>
            </div>
            <div className="text-right">
              <div className="border-t border-gray-400 pt-1 w-32 sm:w-40">
                <p className="text-blue-900 font-semibold text-[10px] sm:text-xs">{issueDate}</p>
                <p className="text-gray-500 text-[8px] sm:text-[10px]">Date of Issue</p>
              </div>
            </div>
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
        }
      `}</style>
    </div>
  );
}
