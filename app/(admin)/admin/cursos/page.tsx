import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCourseButton from "@/components/admin/delete-course-button";

export default async function CursosPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { enrollments: true } },
      modules: { include: { _count: { select: { lessons: true } } } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Gestão</p>
          <h1 className="text-2xl font-semibold text-white tracking-wide">Cursos</h1>
        </div>
        <Link href="/admin/cursos/novo">
          <Button size="sm"><Plus size={14} /> Novo Curso</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-16 text-center"
          style={{ background: "rgba(15,26,61,0.3)" }}>
          <BookOpen size={40} className="text-[rgba(201,169,122,0.3)] mx-auto mb-4" />
          <p className="text-[rgba(255,255,255,0.4)] text-sm">Nenhum curso cadastrado ainda.</p>
          <Link href="/admin/cursos/novo" className="mt-4 inline-block">
            <Button size="sm" variant="ghost">Criar primeiro curso</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map(course => {
            const totalLessons = course.modules.reduce((a, m) => a + m._count.lessons, 0);
            return (
              <div key={course.id}
                className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-5 flex items-center gap-5 hover:border-[rgba(201,169,122,0.25)] transition-all"
                style={{ background: "rgba(15,26,61,0.5)" }}>

                {/* Thumb */}
                <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-[rgba(27,46,107,0.5)] flex items-center justify-center">
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <BookOpen size={20} className="text-[rgba(201,169,122,0.4)]" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-sm font-semibold text-white truncate">{course.title}</h2>
                    {course.published
                      ? <span className="text-[10px] tracking-widest uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Publicado</span>
                      : <span className="text-[10px] tracking-widest uppercase text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-full">Rascunho</span>}
                  </div>
                  <p className="text-xs text-[rgba(255,255,255,0.35)]">
                    {course.modules.length} módulo(s) · {totalLessons} aula(s) · {course._count.enrollments} aluno(s)
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/cursos/${course.id}`}>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </Link>
                  <DeleteCourseButton id={course.id} title={course.title} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
