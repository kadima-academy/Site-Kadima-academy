import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, ChevronRight } from "lucide-react";
import { getGoogleDriveImageUrl } from "@/lib/utils";

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
      {/* ── Hero Banner ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: 260,
          background: "linear-gradient(140deg, #060D1F 0%, #0F1A3D 45%, #1B2E6B 75%, #060D1F 100%)",
          borderBottom: "1px solid rgba(201,169,122,0.15)",
        }}
      >
        {/* Bokeh blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(201,169,122,0.1) 0%, transparent 65%)" }} />
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(27,46,107,0.5) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(201,169,122,0.06) 0%, transparent 70%)" }} />
        </div>

        {/* Stars */}
        <div className="absolute inset-0 stars-bg opacity-70 pointer-events-none" />

        {/* Gold line top */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, transparent 0%, #C9A97A 50%, transparent 100%)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-14">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(201,169,122,0.3) 0%, transparent 65%)", transform: "scale(2.8)" }} />
            <Image
              src="/logo-nova.png"
              alt="Kadima Academy"
              width={100}
              height={100}
              className="relative z-10"
              style={{ filter: "drop-shadow(0 0 32px rgba(201,169,122,0.6))" }}
            />
          </div>

          <h1
            className="text-4xl font-bold text-white mb-2 tracking-widest"
            style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 40px rgba(201,169,122,0.3)" }}
          >
            KADIMA ACADEMY
          </h1>

          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #C9A97A)" }} />
            <p className="text-xs tracking-[4px] uppercase" style={{ color: "#C9A97A" }}>Sua área de membros</p>
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #C9A97A, transparent)" }} />
          </div>

          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Bem-vindo, <span style={{ color: "rgba(255,255,255,0.7)" }}>{firstName}</span>
          </p>
        </div>
      </div>

      {/* ── Courses ── */}
      <div className="px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={14} style={{ color: "#C9A97A" }} />
          <h2 className="text-sm font-semibold text-white tracking-wide">Meus Cursos</h2>
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
            className="rounded-2xl p-14 text-center max-w-sm"
            style={{ background: "rgba(15,26,61,0.5)", border: "1px solid rgba(201,169,122,0.1)" }}
          >
            <BookOpen size={28} className="mx-auto mb-3" style={{ color: "rgba(201,169,122,0.2)" }} />
            <p className="text-sm font-medium text-white mb-1">Nenhum curso ainda</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
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
              const thumbnailUrl = course.thumbnail?.includes("drive.google.com")
                ? getGoogleDriveImageUrl(course.thumbnail)
                : course.thumbnail;

              return (
                <div
                  key={course.id}
                  className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(160deg, rgba(15,26,61,0.8) 0%, rgba(8,16,40,0.9) 100%)",
                    border: "1px solid rgba(201,169,122,0.14)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Thumbnail */}
                  <div className="h-44 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #0A1228 0%, #1B2E6B 100%)" }}>
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={40} style={{ color: "rgba(201,169,122,0.1)" }} />
                      </div>
                    )}
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(8,16,40,0.95) 100%)" }} />

                    {pct === 100 && (
                      <div className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" }}>
                        ✓ Concluído
                      </div>
                    )}

                    {nextLesson && (
                      <Link
                        href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ background: "rgba(0,0,0,0.3)" }}
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: "linear-gradient(135deg, #C9A97A, #9A7A50)",
                            boxShadow: "0 0 32px rgba(201,169,122,0.5)",
                          }}
                        >
                          <Play size={18} fill="#060D1F" color="#060D1F" className="ml-1" />
                        </div>
                      </Link>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-semibold text-white mb-1 leading-snug">{course.title}</h3>
                    <p className="text-[11px] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {done}/{total} aula{total !== 1 ? "s" : ""} concluída{done !== 1 ? "s" : ""}
                    </p>

                    {/* Progress bar */}
                    <div className="h-1 rounded-full mb-4 overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100
                            ? "linear-gradient(90deg,#22c55e,#86efac)"
                            : "linear-gradient(90deg,#C9A97A,#E8D5A8)",
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold" style={{ color: "#C9A97A" }}>{pct}%</span>
                      {nextLesson && (
                        <Link
                          href={`/cursos/${course.slug}/aula/${nextLesson.id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                          style={{
                            background: "rgba(201,169,122,0.1)",
                            border: "1px solid rgba(201,169,122,0.2)",
                            color: "#C9A97A",
                          }}
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
