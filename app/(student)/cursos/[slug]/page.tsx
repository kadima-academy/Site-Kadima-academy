import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getYoutubeId } from "@/lib/utils";
import { CheckCircle, Circle, Play, ArrowLeft } from "lucide-react";

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) return null;
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
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
  });
  if (!course) notFound();

  const allLessons = course.modules.flatMap(m => m.lessons);
  const done = allLessons.filter(l => l.progress[0]?.completed).length;
  const pct = allLessons.length > 0 ? Math.round((done / allLessons.length) * 100) : 0;

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.35)] hover:text-[#C9A97A] mb-6 tracking-wide transition-colors">
        <ArrowLeft size={13} /> Início
      </Link>

      <div className="mb-8">
        <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Curso</p>
        <h1 className="text-2xl font-semibold text-white">{course.title}</h1>
        {course.description && <p className="text-sm text-[rgba(255,255,255,0.45)] mt-2">{course.description}</p>}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full max-w-xs">
            <div className="h-full bg-gradient-to-r from-[#C9A97A] to-[#E8D5A8] rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-[#C9A97A]">{done}/{allLessons.length} aulas · {pct}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {course.modules.map((mod, mi) => (
          <div key={mod.id} className="rounded-2xl border border-[rgba(201,169,122,0.1)] overflow-hidden"
            style={{ background: "rgba(15,26,61,0.4)" }}>
            <div className="px-5 py-4 border-b border-[rgba(201,169,122,0.06)]">
              <p className="text-xs text-[rgba(255,255,255,0.35)] mb-0.5">Módulo {mi + 1}</p>
              <h2 className="text-sm font-semibold text-white">{mod.title}</h2>
            </div>
            <div className="divide-y divide-[rgba(201,169,122,0.05)]">
              {mod.lessons.map((lesson, li) => {
                const ytId = getYoutubeId(lesson.youtubeUrl);
                const completed = lesson.progress[0]?.completed;
                return (
                  <Link key={lesson.id} href={`/cursos/${slug}/aula/${lesson.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-[rgba(255,255,255,0.03)] transition-all group">
                    {ytId
                      ? <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
                          className="w-20 h-12 object-cover rounded-lg shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                      : <div className="w-20 h-12 rounded-lg bg-[rgba(27,46,107,0.5)] shrink-0 flex items-center justify-center">
                          <Play size={14} className="text-[rgba(201,169,122,0.4)]" />
                        </div>}
                    <div className="flex-1">
                      <p className="text-sm text-[rgba(255,255,255,0.8)] group-hover:text-white transition-colors">
                        {li + 1}. {lesson.title}
                      </p>
                      {lesson.duration && <p className="text-xs text-[rgba(255,255,255,0.3)] mt-0.5">{lesson.duration}</p>}
                    </div>
                    {completed
                      ? <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                      : <Circle size={16} className="text-[rgba(255,255,255,0.15)] shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
