import type { Metadata } from "next";

// Admin pages should NOT be indexed by Google / search engines.
export const metadata: Metadata = {
  title: "Vacancies Admin · Ndayeni Solutions",
  description: "Staff sign-in to publish and manage job vacancies.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function VacanciesAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
