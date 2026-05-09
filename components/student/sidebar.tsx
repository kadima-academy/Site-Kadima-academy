"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

const links = [
  {
    href: "/dashboard", label: "Início", exact: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z"/>
      </svg>
    ),
  },
  {
    href: "/cursos", label: "Meus Cursos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0 0 5H20"/>
        <path d="M8 7h8M8 11h6"/>
      </svg>
    ),
  },
  {
    href: "/ao-vivo", label: "Ao Vivo", live: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="14" height="12" rx="2"/>
        <path d="M22 8l-6 4 6 4V8z"/>
      </svg>
    ),
  },
];

export default function StudentSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const initials = user.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "A";

  return (
    <aside className="ka-sidebar">
      {/* Logo */}
      <div style={{ padding: "28px 20px 20px", textAlign: "center" }}>
        <div className="ka-logo-ring" style={{ color: "var(--navy-darkest)" }}>
          <Image src="/logo-nova.png" alt="Kadima Academy" width={52} height={52}
            style={{ borderRadius: "50%", objectFit: "contain" }} />
        </div>
        <div style={{ fontFamily: "var(--font-cinzel,'Cinzel',serif)", fontWeight: 700, fontSize: 22, letterSpacing: 4, color: "var(--text-primary)", marginBottom: 2 }}>
          KADIMA
        </div>
        <div style={{ fontFamily: "var(--font-cinzel,'Cinzel',serif)", fontWeight: 500, fontSize: 11, letterSpacing: 6, color: "var(--gold-light)", textTransform: "uppercase" }}>
          Academy
        </div>
      </div>

      <div className="ka-divider" />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(({ href, label, icon, exact, live }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`ka-nav-btn${active ? " active" : ""}`}>
              <span style={{ color: active ? "var(--gold-bright)" : "var(--gold-light)", opacity: active ? 1 : 0.85, flexShrink: 0 }}>
                {icon}
              </span>
              <span>{label}</span>
              {live && (
                <span className="ka-live-badge">
                  <span className="ka-live-dot" />
                  AO VIVO
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: 16, borderTop: "1px solid rgba(201,169,122,0.10)", background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.30) 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: 8, borderRadius: 12, background: "rgba(255,255,255,0.02)", marginBottom: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
            background: "radial-gradient(circle at 30% 30%, var(--gold-bright) 0%, var(--gold) 50%, var(--gold-deep) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--navy-darkest)", fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 14,
            boxShadow: "0 0 14px rgba(201,169,122,0.45)", border: "1px solid var(--gold-light)",
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.email}
            </div>
          </div>
        </div>
        <button className="ka-logout-btn" onClick={() => signOut({ callbackUrl: "/login" })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
