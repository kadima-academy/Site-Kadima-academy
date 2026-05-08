import { prisma } from "@/lib/prisma";
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react";
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
    { label: "Cursos", value: totalCourses, icon: BookOpen, href: "/admin/cursos" },
    { label: "Alunos", value: totalStudents, icon: Users, href: "/admin/alunos" },
    { label: "Aulas", value: totalLessons, icon: GraduationCap, href: "/admin/cursos" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Painel</p>
        <h1 className="text-2xl font-semibold text-white tracking-wide">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}
            className="rounded-2xl border border-[rgba(201,169,122,0.15)] p-6 hover:border-[rgba(201,169,122,0.3)] transition-all group"
            style={{ background: "rgba(15,26,61,0.6)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(201,169,122,0.1)] flex items-center justify-center">
                <Icon size={18} className="text-[#C9A97A]" />
              </div>
              <TrendingUp size={14} className="text-[rgba(201,169,122,0.4)] group-hover:text-[#C9A97A] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-xs tracking-widest uppercase text-[rgba(255,255,255,0.4)] mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Alunos recentes */}
      <div className="rounded-2xl border border-[rgba(201,169,122,0.12)]"
        style={{ background: "rgba(15,26,61,0.4)" }}>
        <div className="px-6 py-4 border-b border-[rgba(201,169,122,0.1)] flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide text-white">Alunos Recentes</h2>
          <Link href="/admin/alunos" className="text-xs text-[#C9A97A] hover:text-[#E8D5A8] tracking-wide">
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-[rgba(201,169,122,0.06)]">
          {recentStudents.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[rgba(255,255,255,0.3)] text-center">Nenhum aluno cadastrado ainda.</p>
          ) : recentStudents.map(s => (
            <div key={s.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{s.name}</p>
                <p className="text-xs text-[rgba(255,255,255,0.35)]">{s.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#C9A97A]">{s.enrollments.length} curso(s)</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.25)]">
                  {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
