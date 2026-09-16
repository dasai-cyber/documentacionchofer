import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Ficha Registro Conductores — Dasai",
  description:
    "Formulario oficial de enrolamiento y registro de conductores y transportistas para Dasai Logística.",
  keywords: ["Dasai", "Conductores", "Transportistas", "Ficha de Registro", "Logística Chile"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-100 text-slate-900">
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
