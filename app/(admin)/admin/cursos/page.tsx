import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, BookOpen, Layers, Users } from "lucide-react";
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
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[11px] tracking-[5px] uppercase text-[#C9A97A] mb-3 font-medium">Gestão</p>
          <h1 className="text-4xl font-bold text-white tracking-tight">Cursos</h1>
          <p className="text-base text-[rgba(255,255,255,0.4)] mt-2">{courses.length} curso(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/cursos/novo">
          <Button size="sm" className="gap-1.5">
            <Plus size={14} strokeWidth={2.5} />
            Novo Curso
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{
          background: "rgba(15,26,61,0.3)",
          border: "1px solid rgba(201,169,122,0.1)",
        }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(201,169,122,0.08)", border: "1px solid rgba(201,169,122,0.12)" }}>
            <BookOpen size={28} className="text-[rgba(201,169,122,0.4)]" />
          </div>
          <p className="text-[rgba(255,255,255,0.5)] text-sm mb-1">Nenhum curso cadastrado</p>
          <p className="text-[rgba(255,255,255,0.25)] text-xs mb-6">Crie o primeiro curso da plataforma</p>
          <Link href="/admin/cursos/novo">
            <Button size="sm" variant="ghost">Criar primeiro curso</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map(course => {
            const totalLessons = course.modules.reduce((a, m) => a + m._count.lessons, 0);
            return (
              <div key={course.id}
                className="rounded-2xl p-5 flex items-center gap-5 group transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, rgba(15,26,61,0.7) 0%, rgba(10,18,45,0.8) 100%)",
                  border: "1px solid rgba(201,169,122,0.1)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}>

                {/* Thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 relative"
                  style={{ background: "linear-gradient(135deg, rgba(27,46,107,0.6), rgba(15,26,61,0.8))" }}>
                  {course.thumbnail
                    ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                    : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={20} className="text-[rgba(201,169,122,0.3)]" />
                      </div>
                    )}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.3))" }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2">
                    <h2 className="text-sm font-semibold text-white truncate">{course.title}</h2>
                    <span className={`text-[9px] tracking-[2px] uppercase px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                      course.published
                        ? "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
                        : "text-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]"
                    }`}>
                      {course.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.35)]">
                      <Layers size={11} />
                      {course.modules.length} módulo(s)
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.35)]">
                      <BookOpen size={11} />
                      {totalLessons} aula(s)
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.35)]">
                      <Users size={11} />
                      {course._count.enrollments} aluno(s)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/cursos/${course.id}`}>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </Link>
                  <DeleteCourseButton id={course.id} title={course.title} />
                </div>
                <div className="flex items-center gap-2 shrink-0 group-hover:hidden">
                  <Link href={`/admin/cursos/${course.id}`}>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
