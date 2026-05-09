"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, Users, LayoutDashboard, LogOut, Video } from "lucide-react";
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
    <aside
      className="w-[240px] flex flex-col shrink-0 h-screen sticky top-0"
      style={{
        background: "linear-gradient(180deg, #060D1F 0%, #0A1530 60%, #060D1F 100%)",
        borderRight: "1px solid rgba(201,169,122,0.12)",
      }}
    >
      <div className="absolute inset-0 stars-bg pointer-events-none opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #C9A97A, transparent)" }} />

      {/* Logo */}
      <div className="relative flex flex-col items-center pt-8 pb-5 px-6"
        style={{ borderBottom: "1px solid rgba(201,169,122,0.1)" }}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,169,122,0.15) 0%, transparent 70%)" }} />
        <Image
          src="/logo-nova.png"
          alt="Kadima Academy"
          width={80}
          height={80}
          className="relative z-10 mb-3"
          style={{ filter: "drop-shadow(0 0 24px rgba(201,169,122,0.5))" }}
        />
        <p className="text-sm font-bold tracking-[4px] uppercase text-white relative z-10"
          style={{ fontFamily: "var(--font-cinzel)" }}>
          Kadima
        </p>
        <p className="text-[10px] tracking-[3px] uppercase mt-0.5 relative z-10" style={{ color: "#C9A97A" }}>
          Academy
        </p>
        <span
          className="mt-3 text-[9px] font-bold px-3 py-1 rounded-full tracking-widest uppercase relative z-10"
          style={{ background: "rgba(201,169,122,0.1)", color: "#C9A97A", border: "1px solid rgba(201,169,122,0.25)" }}
        >
          Administrador
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 flex flex-col gap-2 relative z-10">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={active ? {
                background: "linear-gradient(135deg, rgba(201,169,122,0.2) 0%, rgba(201,169,122,0.08) 100%)",
                border: "1px solid rgba(201,169,122,0.3)",
                color: "#E8D5A8",
                boxShadow: "0 2px 16px rgba(201,169,122,0.12)",
              } : {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={active ? { background: "rgba(201,169,122,0.2)", boxShadow: "0 0 12px rgba(201,169,122,0.2)" } : { background: "rgba(255,255,255,0.05)" }}
              >
                <Icon size={15} />
              </div>
              <span>{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#C9A97A" }} />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 h-px relative z-10" style={{ background: "linear-gradient(90deg, transparent, rgba(201,169,122,0.12), transparent)" }} />

      {/* User */}
      <div className="p-4 relative z-10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #C9A97A, #9A7A50)", color: "#060D1F" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{user.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title="Sair"
            className="shrink-0 p-1.5 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.2)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
