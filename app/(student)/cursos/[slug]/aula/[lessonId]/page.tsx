import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getYoutubeId } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import ProgressButton from "@/components/student/progress-button";

export default async function AulaPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const session = await auth();
  if (!session) return null;
  const { slug, lessonId } = await params;

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
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  if (currentIndex === -1) notFound();

  const lesson = allLessons[currentIndex];
  const prev = allLessons[currentIndex - 1] ?? null;
  const next = allLessons[currentIndex + 1] ?? null;
  const ytId = getYoutubeId(lesson.youtubeUrl);
  const isCompleted = lesson.progress[0]?.completed ?? false;

  return (
    <div className="flex h-full">
      {/* Player + info */}
      <div className="flex-1 overflow-y-auto p-8">
        <Link href={`/cursos/${slug}`} className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.35)] hover:text-[#C9A97A] mb-6 tracking-wide transition-colors">
          <ArrowLeft size={13} /> {course.title}
        </Link>

        {/* Player YouTube */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-black"
          style={{ aspectRatio: "16/9" }}>
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.3)] text-sm">
              Vídeo não disponível
            </div>
          )}
        </div>

        {/* Título e ações */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{lesson.title}</h1>
            {lesson.duration && <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">{lesson.duration}</p>}
          </div>
          <ProgressButton lessonId={lesson.id} completed={isCompleted} />
        </div>

        {lesson.description && (
          <p className="text-sm text-[rgba(255,255,255,0.5)] mb-6 leading-relaxed">{lesson.description}</p>
        )}

        {lesson.content && (
          <div className="rounded-2xl overflow-hidden mb-6" style={{
            background: "rgba(15,26,61,0.5)",
            border: "1px solid rgba(201,169,122,0.12)",
          }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(201,169,122,0.08)", background: "rgba(201,169,122,0.03)" }}>
              <span className="text-[10px] tracking-[3px] uppercase font-semibold text-[#C9A97A]">Material da Aula</span>
            </div>
            <div
              className="p-6 prose-lesson"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
              style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.8", fontSize: "15px" }}
            />
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between pt-6 border-t border-[rgba(201,169,122,0.1)]">
          {prev ? (
            <Link href={`/cursos/${slug}/aula/${prev.id}`}
              className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.5)] hover:text-white transition-colors">
              <ArrowLeft size={14} /> Aula anterior
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/cursos/${slug}/aula/${next.id}`}
              className="flex items-center gap-2 text-sm text-[#C9A97A] hover:text-[#E8D5A8] transition-colors font-medium">
              Próxima aula <ArrowRight size={14} />
            </Link>
          ) : (
            <Link href={`/cursos/${slug}`}
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              Concluído! Ver curso <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar — lista de aulas */}
      <aside className="w-72 border-l border-[rgba(201,169,122,0.1)] overflow-y-auto shrink-0"
        style={{ background: "rgba(6,13,31,0.8)" }}>
        <div className="px-4 py-4 border-b border-[rgba(201,169,122,0.1)]">
          <p className="text-xs tracking-[2px] uppercase text-[rgba(255,255,255,0.3)]">Conteúdo do Curso</p>
        </div>
        <div className="pb-4">
          {course.modules.map((mod) => (
            <div key={mod.id}>
              <p className="px-4 pt-4 pb-2 text-[10px] tracking-widest uppercase text-[rgba(201,169,122,0.6)]">{mod.title}</p>
              {mod.lessons.map((l) => {
                const active = l.id === lessonId;
                const done = l.progress[0]?.completed;
                return (
                  <Link key={l.id} href={`/cursos/${slug}/aula/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-3 transition-all ${active ? "bg-[rgba(201,169,122,0.1)] border-r-2 border-[#C9A97A]" : "hover:bg-[rgba(255,255,255,0.03)]"}`}>
                    {done
                      ? <CheckCircle size={13} className="text-emerald-400 shrink-0" />
                      : <Circle size={13} className={`shrink-0 ${active ? "text-[#C9A97A]" : "text-[rgba(255,255,255,0.2)]"}`} />}
                    <span className={`text-xs leading-tight ${active ? "text-white font-medium" : "text-[rgba(255,255,255,0.5)]"}`}>
                      {l.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
