"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BookOpen, Users, LayoutDashboard, LogOut, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
  { href: "/admin/alunos", label: "Alunos", icon: Users },
];

export default function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col border-r border-[rgba(201,169,122,0.1)] shrink-0"
      style={{ background: "rgba(6,13,31,0.95)" }}>

      {/* Logo */}
      <div className="flex flex-col items-center py-8 px-6 border-b border-[rgba(201,169,122,0.1)]">
        <Image src="/logo-nova.png" alt="Kadima Academy" width={64} height={64}
          style={{ filter: "drop-shadow(0 0 20px rgba(201,169,122,0.35))" }} />
        <p className="text-xs tracking-[4px] uppercase text-[#C9A97A] mt-3">Academy</p>
        <p className="text-[10px] tracking-widest text-[rgba(255,255,255,0.25)] mt-0.5">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm tracking-wide transition-all",
                active
                  ? "bg-[rgba(201,169,122,0.12)] text-[#C9A97A] border border-[rgba(201,169,122,0.2)]"
                  : "text-[rgba(255,255,255,0.45)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              )}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-[rgba(201,169,122,0.1)]">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[rgba(255,255,255,0.03)]">
          <div className="w-8 h-8 rounded-full bg-[rgba(201,169,122,0.2)] flex items-center justify-center">
            <GraduationCap size={14} className="text-[#C9A97A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{user.name}</p>
            <p className="text-[10px] text-[rgba(255,255,255,0.35)] truncate">{user.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[rgba(255,255,255,0.3)] hover:text-red-400 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
