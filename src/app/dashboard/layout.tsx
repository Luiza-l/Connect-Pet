"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PawPrint, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
    { name: "Meus Pets", href: "/dashboard/pets", icon: PawPrint },
    { name: "Configurações", href: "#", icon: Settings },
  ];

  const NavLinks = () => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-bold">Painel do Protetor</h2>
            <p className="text-sm text-muted-foreground">Gerencie seus resgates</p>
          </div>
          <NavLinks />
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" asChild>
            <Link href="/">
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar & Content Wrapper */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
          <h2 className="text-lg font-bold">Painel do Protetor</h2>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="py-6">
                <div className="mb-8 px-4">
                  <h2 className="text-xl font-bold">Painel do Protetor</h2>
                </div>
                <NavLinks />
                <div className="mt-8 px-4">
                  <Button variant="ghost" className="w-full justify-start text-red-500" asChild>
                    <Link href="/">
                      <LogOut className="mr-3 h-5 w-5" />
                      Sair
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
