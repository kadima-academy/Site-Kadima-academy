"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, LogOut, Video } from "lucide-react";
import Image from "next/image";

const links = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/cursos", label: "Meus Cursos", icon: BookOpen },
  { href: "/ao-vivo", label: "Ao Vivo", icon: Video },
];

export default function StudentSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const initials = user.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "A";

  return (
    <aside
      className="w-[220px] flex flex-col shrink-0 h-screen sticky top-0"
      style={{ background: "#0a0a0a", borderRight: "1px solid #1e1e1e" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <Image src="/logo-nova.png" alt="Kadima Academy" width={34} height={34}
          style={{ filter: "drop-shadow(0 0 8px rgba(201,169,122,0.3))" }} />
        <div>
          <p className="text-xs font-bold text-white leading-tight" style={{ fontFamily: "var(--font-barlow)", letterSpacing: "2px" }}>
            KADIMA
          </p>
          <p className="text-[10px] leading-tight" style={{ color: "#C9A97A", letterSpacing: "1px" }}>
            ACADEMY
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative"
              style={active ? {
                background: "rgba(201,169,122,0.08)",
                color: "#C9A97A",
                borderLeft: "2px solid #C9A97A",
              } : {
                color: "#666",
                borderLeft: "2px solid transparent",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "#aaa"; }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#666"; } }}
            >
              <Icon size={15} />
              <span className="font-medium text-[13px]">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid #1a1a1a", paddingTop: "12px" }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: "#111" }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#C9A97A,#9A7A50)", color: "#0D0D0D" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] truncate" style={{ color: "#555" }}>{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sair"
            className="shrink-0 transition-colors"
            style={{ color: "#444" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={e => (e.currentTarget.style.color = "#444")}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
