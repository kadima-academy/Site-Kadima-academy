import { prisma } from "@/lib/prisma";
import { BookOpen, Users, GraduationCap, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalCourses, totalStudents, totalLessons, recentStudents] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.lesson.count(),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, enrollments: { select: { courseId: true } } },
    }),
  ]);

  const stats = [
    { label: "Cursos", value: totalCourses, icon: BookOpen, href: "/admin/cursos", color: "rgba(201,169,122,0.15)", glow: "rgba(201,169,122,0.08)" },
    { label: "Alunos", value: totalStudents, icon: Users, href: "/admin/alunos", color: "rgba(99,179,237,0.1)", glow: "rgba(99,179,237,0.05)" },
    { label: "Aulas", value: totalLessons, icon: GraduationCap, href: "/admin/cursos", color: "rgba(154,230,180,0.1)", glow: "rgba(154,230,180,0.05)" },
  ];

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] tracking-[5px] uppercase text-[#C9A97A] mb-3 font-medium">Painel de Controle</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-base text-[rgba(255,255,255,0.4)] mt-2">Visão geral da plataforma Kadima Academy</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, href, color, glow }) => (
          <Link key={label} href={href}
            className="rounded-2xl p-6 group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, rgba(15,26,61,0.8) 0%, rgba(10,18,45,0.9) 100%)`,
              border: "1px solid rgba(201,169,122,0.12)",
              boxShadow: `0 4px 24px ${glow}`,
            }}>
            <div className="flex items-start justify-between mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color }}>
                <Icon size={19} className="text-[#C9A97A]" />
              </div>
              <ArrowUpRight size={15} className="text-[rgba(201,169,122,0.3)] group-hover:text-[#C9A97A] transition-colors mt-1" />
            </div>
            <p className="text-5xl font-bold text-white tabular-nums mb-2">{value}</p>
            <p className="text-[11px] tracking-[4px] uppercase text-[rgba(255,255,255,0.4)] font-semibold">{label}</p>
          </Link>
        ))}
      </div>

      {/* Alunos recentes */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: "rgba(10,18,45,0.6)",
        border: "1px solid rgba(201,169,122,0.1)",
      }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{
          borderBottom: "1px solid rgba(201,169,122,0.08)",
          background: "rgba(201,169,122,0.03)",
        }}>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide">Alunos Recentes</h2>
            <p className="text-[11px] text-[rgba(255,255,255,0.3)] mt-0.5">Últimos cadastros na plataforma</p>
          </div>
          <Link href="/admin/alunos"
            className="text-xs text-[#C9A97A] hover:text-[#E8D5A8] transition-colors flex items-center gap-1 font-medium">
            Ver todos <ArrowUpRight size={12} />
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users size={32} className="text-[rgba(201,169,122,0.2)] mx-auto mb-3" />
            <p className="text-sm text-[rgba(255,255,255,0.3)]">Nenhum aluno cadastrado ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(201,169,122,0.05)]">
            {recentStudents.map(s => {
              const initials = s.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
              return (
                <div key={s.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#060D1F] shrink-0"
                    style={{ background: "linear-gradient(135deg, #D4B483, #B8924A)" }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{s.name}</p>
                    <p className="text-xs text-[rgba(255,255,255,0.35)] truncate">{s.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-[#C9A97A]">{s.enrollments.length} curso(s)</p>
                    <p className="text-[11px] text-[rgba(255,255,255,0.25)] mt-0.5">
                      {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
