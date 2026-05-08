import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Play, ChevronRight, Lock } from "lucide-react";

export default async function CursosPage() {
  const session = await auth();
  if (!session) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: { progress: { where: { userId: session.user.id } } },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] tracking-[5px] uppercase text-[#C9A97A] mb-3 font-medium">Minha Jornada</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">Meus Cursos</h1>
        <p className="text-base text-[rgba(255,255,255,0.4)] mt-2">{enrollments.length} curso(s) matriculado(s)</p>
      </div>

      <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, rgba(201,169,122,0.15), transparent)" }} />

      {enrollments.length === 0 ? (
        <div className="rounded-2xl p-16 text-center max-w-md" style={{
          background: "linear-gradient(135deg, rgba(15,26,61,0.4), rgba(10,18,45,0.5))",
          border: "1px solid rgba(201,169,122,0.1)",
        }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(201,169,122,0.08)", border: "1px solid rgba(201,169,122,0.12)" }}>
            <BookOpen size={28} className="text-[rgba(201,169,122,0.4)]" />
          </div>
          <p className="text-[rgba(255,255,255,0.6)] text-sm font-medium mb-1">Nenhum curso ainda</p>
          <p className="text-[rgba(255,255,255,0.25)] text-xs leading-relaxed">
            Entre em contato com a administração para se matricular.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-3xl">
          {enrollments.map(({ course }) => {
            const allLessons = course.modules.flatMap(m => m.lessons);
            const done = allLessons.filter(l => l.progress[0]?.completed).length;
            const total = allLessons.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const nextLesson = allLessons.find(l => !l.progress[0]?.completed) ?? allLessons[0];

            return (
              <div key={course.id} className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(15,26,61,0.7), rgba(10,18,45,0.85))",
                  border: "1px solid rgba(201,169,122,0.12)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                }}>

                {/* Course header */}
                <div className="h-28 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #0F1A3D, #1B2E6B)" }}>
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-40" />
                    : <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={36} className="text-[rgba(201,169,122,0.12)]" />
                      </div>}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 20%, rgba(6,13,31,0.85) 100%)" }} />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <h2 className="text-lg font-bold text-white">{course.title}</h2>
                    {pct === 100 && (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ml-3"
                        style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
                        ✓ Concluído
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100
                            ? "linear-gradient(90deg, #6ee7b7, #34d399)"
                            : "linear-gradient(90deg, #C9A97A, #E8D5A8)",
                        }} />
                    </div>
                    <span className="text-xs font-bold text-[#C9A97A] shrink-0">{pct}%</span>
                    <span className="text-xs text-[rgba(255,255,255,0.3)] shrink-0">{done}/{total} aulas</span>
                  </div>

                  {/* Continue button */}
                  {nextLesson && (
                    <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] group/btn"
                      style={{
                        background: "linear-gradient(135deg, rgba(201,169,122,0.12), rgba(201,169,122,0.06))",
                        border: "1px solid rgba(201,169,122,0.18)",
                      }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #D4B483, #B8924A)" }}>
                        <Play size={11} fill="#060D1F" className="translate-x-px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#C9A97A]">
                          {pct === 0 ? "Começar curso" : pct === 100 ? "Rever curso" : "Continuar de onde parei"}
                        </p>
                        <p className="text-[11px] text-[rgba(255,255,255,0.35)] truncate mt-0.5">{nextLesson.title}</p>
                      </div>
                      <ChevronRight size={15} className="text-[rgba(201,169,122,0.4)] group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  )}

                  {/* Modules list */}
                  {course.modules.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                      {course.modules.map(mod => {
                        const modDone = mod.lessons.filter(l => l.progress[0]?.completed).length;
                        const modTotal = mod.lessons.length;
                        const firstLesson = mod.lessons[0];
                        return (
                          <div key={mod.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: modDone === modTotal && modTotal > 0 ? "rgba(16,185,129,0.15)" : "rgba(201,169,122,0.08)" }}>
                              {modDone === modTotal && modTotal > 0
                                ? <span className="text-[10px] text-emerald-400">✓</span>
                                : <Lock size={10} className="text-[rgba(201,169,122,0.4)]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[rgba(255,255,255,0.7)] truncate">{mod.title}</p>
                              <p className="text-[10px] text-[rgba(255,255,255,0.3)]">{modDone}/{modTotal} aulas</p>
                            </div>
                            {firstLesson && (
                              <Link href={`/cursos/${course.slug}/aula/${firstLesson.id}`}
                                className="text-[10px] text-[#C9A97A] hover:text-[#E8D5A8] transition-colors font-medium shrink-0">
                                Ver →
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
