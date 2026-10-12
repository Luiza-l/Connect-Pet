import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { AuthRequiredDialog } from "@/components/auth/AuthRequiredDialog";
import { AnimacoesDaPagina } from "@/components/layout/AnimacoesDaPagina";
import { Analytics } from '@vercel/analytics/next';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ConnectPet - Adoção Responsável de Cães e Gatos",
  description: "Conectando adotantes conscientes a ONGs e protetores sérios. Triagem criteriosa, 100% ética e gratuita para garantir o lar perfeito.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" }
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <a
          href="#conteudo-principal"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <Navbar />
            <main id="conteudo-principal" className="flex-1" tabIndex={-1}>
              <AnimacoesDaPagina>{children}</AnimacoesDaPagina>
            </main>
            <Footer />
            <ToastContainer />
            <AuthRequiredDialog />
          </AppProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
