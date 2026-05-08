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
      select: { id: true, name: true, email: true, createdAt: true, church: true, enrollments: { select: { courseId: true } } },
    }),
  ]);

  const stats = [
    { label: "Cursos", value: totalCourses, icon: BookOpen, href: "/admin/cursos" },
    { label: "Alunos", value: totalStudents, icon: Users, href: "/admin/alunos" },
    { label: "Aulas", value: totalLessons, icon: GraduationCap, href: "/admin/cursos" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] tracking-[4px] uppercase mb-1 font-medium" style={{ color: "#C9A97A" }}>
          Painel de Controle
        </p>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-barlow)", letterSpacing: "1px" }}>
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl p-5 group transition-all hover:-translate-y-0.5"
            style={{ background: "#111", border: "1px solid #222" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(201,169,122,0.1)" }}
              >
                <Icon size={16} style={{ color: "#C9A97A" }} />
              </div>
              <ArrowUpRight
                size={14}
                className="transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: "#333" }}
              />
            </div>
            <p className="text-4xl font-black text-white tabular-nums leading-none mb-2"
              style={{ fontFamily: "var(--font-barlow)" }}>
              {value}
            </p>
            <p className="text-[10px] tracking-[3px] uppercase font-semibold" style={{ color: "#555" }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Alunos recentes */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#111", border: "1px solid #222" }}>
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #1a1a1a" }}
        >
          <div>
            <h2 className="text-sm font-semibold text-white">Alunos Recentes</h2>
            <p className="text-[11px] mt-0.5" style={{ color: "#555" }}>Últimos cadastros na plataforma</p>
          </div>
          <Link
            href="/admin/alunos"
            className="text-xs font-medium flex items-center gap-1 transition-colors"
            style={{ color: "#C9A97A" }}
          >
            Ver todos <ArrowUpRight size={11} />
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Users size={24} className="mx-auto mb-2" style={{ color: "#333" }} />
            <p className="text-sm" style={{ color: "#555" }}>Nenhum aluno cadastrado ainda.</p>
          </div>
        ) : (
          <div>
            {recentStudents.map((s, i) => {
              const initials = s.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
              return (
                <div
                  key={s.id}
                  className="px-5 py-3.5 flex items-center gap-3 transition-colors"
                  style={{
                    borderTop: i > 0 ? "1px solid #1a1a1a" : undefined,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg,#C9A97A,#9A7A50)", color: "#0D0D0D" }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{s.name}</p>
                    <p className="text-[11px] truncate" style={{ color: "#555" }}>{s.email}</p>
                  </div>
                  {s.church && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded shrink-0"
                      style={{ background: "rgba(201,169,122,0.07)", color: "#C9A97A", border: "1px solid rgba(201,169,122,0.15)" }}
                    >
                      {s.church}
                    </span>
                  )}
                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-medium" style={{ color: "#C9A97A" }}>{s.enrollments.length} curso(s)</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#444" }}>
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
