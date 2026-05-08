import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import EnrollButton from "@/components/admin/enroll-button";

export default async function StudentProfilePage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;

  const [student, allCourses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  orderBy: { order: "asc" },
                  include: {
                    lessons: {
                      orderBy: { order: "asc" },
                      include: { progress: { where: { userId: studentId } } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.course.findMany({ where: { published: true }, select: { id: true, title: true } }),
  ]);

  if (!student) notFound();

  const enrolledIds = student.enrollments.map(e => e.courseId);
  const notEnrolled = allCourses.filter(c => !enrolledIds.includes(c.id));

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/alunos" className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.35)] hover:text-[#C9A97A] mb-8 tracking-wide transition-colors">
        <ArrowLeft size={13} /> Alunos
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Perfil</p>
          <h1 className="text-2xl font-semibold text-white">{student.name}</h1>
          <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">{student.email}</p>
        </div>
        {notEnrolled.length > 0 && (
          <EnrollButton studentId={studentId} courses={notEnrolled} />
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Telefone", value: student.phone ?? "—" },
          { label: "Igreja", value: student.church ?? "—" },
          { label: "Cadastrado em", value: new Date(student.createdAt).toLocaleDateString("pt-BR") },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-[rgba(201,169,122,0.1)] p-4"
            style={{ background: "rgba(15,26,61,0.4)" }}>
            <p className="text-[10px] tracking-widest uppercase text-[rgba(255,255,255,0.3)] mb-1">{label}</p>
            <p className="text-sm text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Progresso por curso */}
      <h2 className="text-sm font-semibold text-white tracking-wide mb-4">Progresso nos Cursos</h2>
      <div className="flex flex-col gap-4">
        {student.enrollments.length === 0 ? (
          <p className="text-sm text-[rgba(255,255,255,0.3)]">Nenhum curso matriculado.</p>
        ) : student.enrollments.map(({ course }) => {
          const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
          const doneLessons = course.modules.reduce((a, m) => a + m.lessons.filter(l => l.progress[0]?.completed).length, 0);
          const pct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

          return (
            <div key={course.id} className="rounded-2xl border border-[rgba(201,169,122,0.1)] overflow-hidden"
              style={{ background: "rgba(15,26,61,0.4)" }}>
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{course.title}</p>
                  <p className="text-xs text-[rgba(255,255,255,0.35)] mt-0.5">{doneLessons}/{totalLessons} aulas concluídas</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#C9A97A]">{pct}%</p>
                </div>
              </div>
              <div className="h-1 bg-[rgba(255,255,255,0.05)]">
                <div className="h-full bg-gradient-to-r from-[#C9A97A] to-[#E8D5A8] transition-all"
                  style={{ width: `${pct}%` }} />
              </div>
              {course.modules.map(mod => (
                <div key={mod.id} className="border-t border-[rgba(201,169,122,0.06)] px-5 py-3">
                  <p className="text-xs text-[rgba(255,255,255,0.4)] mb-2">{mod.title}</p>
                  <div className="flex flex-col gap-1">
                    {mod.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-2">
                        {lesson.progress[0]?.completed
                          ? <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                          : <Circle size={12} className="text-[rgba(255,255,255,0.2)] shrink-0" />}
                        <span className="text-xs text-[rgba(255,255,255,0.5)]">{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
