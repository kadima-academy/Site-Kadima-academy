import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Play, ChevronRight } from "lucide-react";

function getGreeting() {
  const h = new Date().getUTCHours() - 3;
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

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
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[4px] uppercase text-[#C9A97A] mb-2">{getGreeting()}</p>
        <h1 className="text-3xl font-semibold text-white tracking-tight">{firstName}</h1>
        <p className="text-sm text-[rgba(255,255,255,0.35)] mt-1">Escola Teológica Online · Kadima Academy</p>
      </div>

      {/* Divider */}
      <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, rgba(201,169,122,0.15), transparent)" }} />

      {enrollments.length === 0 ? (
        <div className="rounded-2xl p-16 text-center max-w-md" style={{
          background: "linear-gradient(135deg, rgba(15,26,61,0.4) 0%, rgba(10,18,45,0.5) 100%)",
          border: "1px solid rgba(201,169,122,0.1)",
        }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(201,169,122,0.08)", border: "1px solid rgba(201,169,122,0.12)" }}>
            <BookOpen size={28} className="text-[rgba(201,169,122,0.4)]" />
          </div>
          <p className="text-[rgba(255,255,255,0.6)] text-sm font-medium mb-1">Nenhum curso ainda</p>
          <p className="text-[rgba(255,255,255,0.25)] text-xs leading-relaxed">
            Entre em contato com a administração para se matricular em um curso.
          </p>
        </div>
      ) : (
        <>
          <p className="text-[10px] tracking-[3px] uppercase text-[rgba(255,255,255,0.3)] mb-4 font-medium">
            Meus Cursos · {enrollments.length}
          </p>
          <div className="grid grid-cols-1 gap-5 max-w-2xl">
            {enrollments.map(({ course }) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const done = allLessons.filter(l => l.progress[0]?.completed).length;
              const total = allLessons.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const nextLesson = allLessons.find(l => !l.progress[0]?.completed) ?? allLessons[0];

              return (
                <div key={course.id}
                  className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, rgba(15,26,61,0.7) 0%, rgba(10,18,45,0.8) 100%)",
                    border: "1px solid rgba(201,169,122,0.12)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                  }}>

                  {/* Thumbnail banner */}
                  <div className="h-32 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0F1A3D 0%, #1B2E6B 100%)" }}>
                    {course.thumbnail
                      ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-50" />
                      : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen size={40} className="text-[rgba(201,169,122,0.15)]" />
                        </div>
                      )}
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(to bottom, transparent 30%, rgba(6,13,31,0.9) 100%)"
                    }} />

                    {pct === 100 && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
                        style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
                        ✓ Concluído
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-base font-semibold text-white mb-1">{course.title}</h2>
                    <p className="text-[12px] text-[rgba(255,255,255,0.35)] mb-4">
                      {done} de {total} aula{total !== 1 ? "s" : ""} concluída{done !== 1 ? "s" : ""}
                    </p>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100
                            ? "linear-gradient(90deg, #6ee7b7, #34d399)"
                            : "linear-gradient(90deg, #C9A97A, #E8D5A8)",
                        }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#C9A97A]">{pct}% completo</span>
                      {nextLesson && (
                        <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                          className="flex items-center gap-2 text-xs font-semibold text-[#C9A97A] hover:text-[#E8D5A8] transition-colors group/btn">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(201,169,122,0.15)" }}>
                            <Play size={9} fill="currentColor" />
                          </div>
                          {pct > 0 && pct < 100 ? "Continuar" : pct === 100 ? "Rever" : "Começar"}
                          <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
