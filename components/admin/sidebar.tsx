"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, Users, LayoutDashboard, LogOut, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
  { href: "/admin/alunos", label: "Alunos", icon: Users },
  { href: "/admin/ao-vivo", label: "Ao Vivo", icon: Video },
];

export default function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const initials = user.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "A";

  return (
    <aside className="w-64 flex flex-col shrink-0 relative" style={{
      background: "linear-gradient(180deg, rgba(8,16,40,0.98) 0%, rgba(6,13,31,0.98) 100%)",
      borderRight: "1px solid rgba(201,169,122,0.08)",
    }}>
      {/* Glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,169,122,0.08) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="flex flex-col items-center pt-8 pb-6 px-6 relative">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(201,169,122,0.2) 0%, transparent 70%)", transform: "scale(1.5)" }} />
          <Image src="/logo-nova.png" alt="Kadima Academy" width={72} height={72}
            className="relative z-10"
            style={{ filter: "drop-shadow(0 0 24px rgba(201,169,122,0.4))" }} />
        </div>
        <h1 className="text-xs tracking-[5px] uppercase text-[#C9A97A] font-medium">Kadima</h1>
        <p className="text-[10px] tracking-[3px] uppercase text-[rgba(255,255,255,0.3)] mt-0.5">Academy</p>
        <div className="mt-3 px-3 py-1 rounded-full text-[9px] tracking-[2px] uppercase font-semibold"
          style={{ background: "rgba(201,169,122,0.1)", border: "1px solid rgba(201,169,122,0.2)", color: "#C9A97A" }}>
          Administrador
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,122,0.15), transparent)" }} />

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1 mt-2">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 relative group",
                active
                  ? "text-[#C9A97A]"
                  : "text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)]"
              )}
              style={active ? {
                background: "linear-gradient(90deg, rgba(201,169,122,0.12) 0%, rgba(201,169,122,0.04) 100%)",
                border: "1px solid rgba(201,169,122,0.15)",
              } : undefined}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #D4B483, #C9A97A)" }} />
              )}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                active ? "bg-[rgba(201,169,122,0.15)]" : "bg-[rgba(255,255,255,0.04)] group-hover:bg-[rgba(255,255,255,0.07)]"
              )}>
                <Icon size={15} />
              </div>
              <span className="tracking-wide font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,122,0.1), transparent)" }} />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#060D1F] shrink-0"
            style={{ background: "linear-gradient(135deg, #D4B483, #B8924A)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user.name}</p>
            <p className="text-[10px] text-[rgba(255,255,255,0.3)] truncate">{user.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sair"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[rgba(255,255,255,0.25)] hover:text-red-400 hover:bg-red-900/20 transition-all">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
