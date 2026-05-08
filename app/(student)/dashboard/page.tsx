import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, ChevronRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: { progress: { where: { userId: session.user.id } } },
              },
            },
          },
        },
      },
    },
  });

  const firstName = session.user.name?.split(" ")[0] ?? "Aluno";

  return (
    <div>
      {/* ── Hero ── */}
      <div
        className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center"
        style={{
          minHeight: 220,
          background: "linear-gradient(160deg, #111 0%, #0D0D0D 60%, #111 100%)",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {/* Subtle gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(201,169,122,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center py-12 px-8">
          <Image
            src="/logo-nova.png"
            alt="Kadima Academy"
            width={72}
            height={72}
            className="mb-4"
            style={{ filter: "drop-shadow(0 0 20px rgba(201,169,122,0.35))" }}
          />
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: "var(--font-barlow)", letterSpacing: "3px" }}
          >
            KADIMA ACADEMY
          </h1>
          <p className="text-sm mb-3" style={{ color: "#C9A97A", letterSpacing: "2px" }}>
            SUA ÁREA DE MEMBROS
          </p>
          <p className="text-sm" style={{ color: "#555" }}>
            Bem-vindo, {firstName}
          </p>
        </div>
      </div>

      {/* ── Courses ── */}
      <div className="px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={14} style={{ color: "#C9A97A" }} />
          <h2 className="text-sm font-semibold text-white">Meus Cursos</h2>
          {enrollments.length > 0 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-1"
              style={{ background: "rgba(201,169,122,0.1)", color: "#C9A97A", border: "1px solid rgba(201,169,122,0.2)" }}
            >
              {enrollments.length}
            </span>
          )}
        </div>

        {enrollments.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center max-w-sm"
            style={{ background: "#111", border: "1px solid #222" }}
          >
            <BookOpen size={28} className="mx-auto mb-3" style={{ color: "#333" }} />
            <p className="text-sm font-medium text-white mb-1">Nenhum curso ainda</p>
            <p className="text-xs leading-relaxed" style={{ color: "#555" }}>
              Entre em contato com a administração para se matricular.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map(({ course }) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const done = allLessons.filter(l => l.progress[0]?.completed).length;
              const total = allLessons.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const nextLesson = allLessons.find(l => !l.progress[0]?.completed) ?? allLessons[0];

              return (
                <div
                  key={course.id}
                  className="rounded-xl overflow-hidden group transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "#111", border: "1px solid #222" }}
                >
                  {/* Thumbnail */}
                  <div className="h-40 relative overflow-hidden" style={{ background: "#0a0a0a" }}>
                    {course.thumbnail
                      ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                      : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen size={32} style={{ color: "#222" }} />
                        </div>
                      )}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(17,17,17,0.9) 100%)" }}
                    />
                    {pct === 100 && (
                      <div
                        className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.25)" }}
                      >
                        ✓ Concluído
                      </div>
                    )}
                    {nextLesson && (
                      <Link
                        href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(201,169,122,0.9)" }}
                        >
                          <Play size={14} fill="#0D0D0D" color="#0D0D0D" className="ml-0.5" />
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-0.5 leading-tight">{course.title}</h3>
                    <p className="text-[11px] mb-3" style={{ color: "#555" }}>
                      {done}/{total} aula{total !== 1 ? "s" : ""} concluída{done !== 1 ? "s" : ""}
                    </p>

                    <div className="h-0.5 rounded-full mb-3 overflow-hidden" style={{ background: "#222" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? "#22c55e" : "#C9A97A",
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold" style={{ color: "#C9A97A" }}>{pct}%</span>
                      {nextLesson && (
                        <Link
                          href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                          className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
                          style={{ color: "#C9A97A" }}
                        >
                          {pct > 0 && pct < 100 ? "Continuar" : pct === 100 ? "Rever" : "Começar"}
                          <ChevronRight size={12} />
                        </Link>
                      )}
                    </div>
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
