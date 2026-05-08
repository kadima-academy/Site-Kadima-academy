import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Play } from "lucide-react";

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Bem-vindo</p>
        <h1 className="text-2xl font-semibold text-white">{session.user.name}</h1>
        <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">Escola Teológica Online · Kadima Academy</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-16 text-center"
          style={{ background: "rgba(15,26,61,0.3)" }}>
          <BookOpen size={40} className="text-[rgba(201,169,122,0.3)] mx-auto mb-4" />
          <p className="text-[rgba(255,255,255,0.4)] text-sm">Você ainda não está matriculado em nenhum curso.</p>
          <p className="text-[rgba(255,255,255,0.25)] text-xs mt-2">Entre em contato com a administração para se matricular.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {enrollments.map(({ course }) => {
            const allLessons = course.modules.flatMap(m => m.lessons);
            const done = allLessons.filter(l => l.progress[0]?.completed).length;
            const total = allLessons.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const firstLesson = course.modules[0]?.lessons[0];

            return (
              <div key={course.id}
                className="rounded-2xl border border-[rgba(201,169,122,0.12)] overflow-hidden hover:border-[rgba(201,169,122,0.25)] transition-all group"
                style={{ background: "rgba(15,26,61,0.5)" }}>

                {/* Thumbnail */}
                <div className="h-36 bg-gradient-to-br from-[#0F1A3D] to-[#1B2E6B] relative overflow-hidden">
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
                    : <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={36} className="text-[rgba(201,169,122,0.25)]" />
                      </div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060D1F] via-transparent" />
                  {pct > 0 && (
                    <div className="absolute bottom-3 right-3 bg-[rgba(6,13,31,0.85)] px-2 py-1 rounded-full text-xs text-[#C9A97A] font-semibold">
                      {pct}%
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-sm font-semibold text-white mb-1">{course.title}</h2>
                  <p className="text-xs text-[rgba(255,255,255,0.35)] mb-4">{done}/{total} aulas concluídas</p>

                  {/* Barra de progresso */}
                  <div className="h-1 bg-[rgba(255,255,255,0.08)] rounded-full mb-4">
                    <div className="h-full bg-gradient-to-r from-[#C9A97A] to-[#E8D5A8] rounded-full transition-all"
                      style={{ width: `${pct}%` }} />
                  </div>

                  {firstLesson && (
                    <Link href={`/cursos/${course.slug}/aula/${firstLesson.id}`}
                      className="inline-flex items-center gap-2 text-xs text-[#C9A97A] hover:text-[#E8D5A8] transition-colors font-medium">
                      <Play size={12} fill="currentColor" />
                      {pct > 0 ? "Continuar" : "Começar"}
                    </Link>
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
