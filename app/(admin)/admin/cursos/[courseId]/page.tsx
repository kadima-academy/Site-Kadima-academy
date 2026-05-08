import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CourseEditor from "@/components/admin/course-editor";

export default async function EditCursoPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!course) notFound();

  return (
    <div className="p-8">
      <Link href="/admin/cursos" className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.35)] hover:text-[#C9A97A] mb-8 tracking-wide transition-colors">
        <ArrowLeft size={13} /> Cursos
      </Link>
      <CourseEditor course={course} />
    </div>
  );
}
