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
    <div className="flex flex-col">

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 240 }}>
        {/* Background */}
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #060D1F 0%, #0F1A3D 40%, #1B2960 70%, #0A1228 100%)",
          }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,169,122,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,122,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gold glow orbs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,169,122,0.12) 0%, transparent 65%)" }} />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(30,60,180,0.18) 0%, transparent 65%)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-14">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(201,169,122,0.25) 0%, transparent 70%)", transform: "scale(2.5)" }} />
            <Image
              src="/logo-nova.png"
              alt="Kadima Academy"
              width={96}
              height={96}
              className="relative z-10"
              style={{ filter: "drop-shadow(0 0 32px rgba(201,169,122,0.5))" }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Kadima Academy
          </h1>
          <p className="text-sm text-[rgba(201,169,122,0.8)] tracking-[3px] uppercase font-medium">
            Sua área de membros
          </p>
          <p className="text-xs text-[rgba(255,255,255,0.3)] mt-3">
            Bem-vindo, {firstName}
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(6,13,31,1))" }} />
      </div>

      {/* ── Courses ── */}
      <div className="p-8 pt-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={14} className="text-[#C9A97A]" />
          <p className="text-sm font-semibold text-white tracking-wide">Meus Cursos</p>
          {enrollments.length > 0 && (
            <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: "rgba(201,169,122,0.12)", color: "#C9A97A", border: "1px solid rgba(201,169,122,0.2)" }}>
              {enrollments.length}
            </span>
          )}
        </div>

        {enrollments.length === 0 ? (
          <div className="rounded-2xl p-14 text-center max-w-sm" style={{
            background: "rgba(15,26,61,0.4)",
            border: "1px solid rgba(201,169,122,0.1)",
          }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "rgba(201,169,122,0.07)", border: "1px solid rgba(201,169,122,0.12)" }}>
              <BookOpen size={24} className="text-[rgba(201,169,122,0.35)]" />
            </div>
            <p className="text-[rgba(255,255,255,0.5)] text-sm mb-1">Nenhum curso ainda</p>
            <p className="text-[rgba(255,255,255,0.2)] text-xs leading-relaxed">
              Entre em contato com a administração para se matricular.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map(({ course }) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const done = allLessons.filter(l => l.progress[0]?.completed).length;
              const total = allLessons.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const nextLesson = allLessons.find(l => !l.progress[0]?.completed) ?? allLessons[0];

              return (
                <div key={course.id}
                  className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    background: "linear-gradient(160deg, rgba(15,26,61,0.8) 0%, rgba(8,16,40,0.9) 100%)",
                    border: "1px solid rgba(201,169,122,0.12)",
                  }}>

                  {/* Thumbnail */}
                  <div className="h-36 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0A1228 0%, #1B2960 100%)" }}>
                    {course.thumbnail
                      ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                      : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen size={36} className="text-[rgba(201,169,122,0.12)]" />
                        </div>
                      )}
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(6,13,31,0.85) 100%)" }} />

                    {pct === 100 && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
                        ✓ Concluído
                      </div>
                    )}

                    {/* Play button overlay on hover */}
                    {nextLesson && (
                      <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(201,169,122,0.9)", boxShadow: "0 0 24px rgba(201,169,122,0.4)" }}>
                          <Play size={16} fill="#060D1F" className="text-[#060D1F] ml-0.5" />
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-sm font-semibold text-white mb-0.5 leading-tight">{course.title}</h2>
                    <p className="text-[11px] text-[rgba(255,255,255,0.3)] mb-3">
                      {done}/{total} aula{total !== 1 ? "s" : ""} concluída{done !== 1 ? "s" : ""}
                    </p>

                    {/* Progress */}
                    <div className="h-1 rounded-full mb-3 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? "linear-gradient(90deg,#6ee7b7,#34d399)" : "linear-gradient(90deg,#C9A97A,#E8D5A8)",
                        }} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[rgba(201,169,122,0.7)]">{pct}%</span>
                      {nextLesson && (
                        <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C9A97A] hover:text-[#E8D5A8] transition-colors">
                          {pct > 0 && pct < 100 ? "Continuar" : pct === 100 ? "Rever" : "Começar"}
                          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
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
