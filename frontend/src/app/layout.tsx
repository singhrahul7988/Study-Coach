import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";
import "./library.css";
import "./journey.css";
import "./study.css";
import "./progress.css";
import "./today.css";
import "./refined-theme.css";
import "./account.css";
import "./profile.css";
import "./icon-accents.css";
import "./landing-showcase.css";
import "./curating-checklist.css";
import "./coach-composer.css";
import "./school.css";

export const metadata: Metadata = {
  title: "Ranjan Sir | Study Coach",
  description: "A study coach that starts with you.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
