import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AlunosPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: { enrollments: { include: { course: { select: { title: true } } } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Gestão</p>
          <h1 className="text-2xl font-semibold text-white tracking-wide">Alunos</h1>
        </div>
        <Link href="/admin/alunos/novo">
          <Button size="sm"><Plus size={14} /> Cadastrar Aluno</Button>
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-16 text-center"
          style={{ background: "rgba(15,26,61,0.3)" }}>
          <Users size={40} className="text-[rgba(201,169,122,0.3)] mx-auto mb-4" />
          <p className="text-[rgba(255,255,255,0.4)] text-sm">Nenhum aluno cadastrado ainda.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] overflow-hidden"
          style={{ background: "rgba(15,26,61,0.4)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(201,169,122,0.08)]">
                {["Nome", "E-mail", "Igreja", "Cursos", "Cadastro", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[2px] uppercase text-[rgba(255,255,255,0.3)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(201,169,122,0.06)]">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-5 py-4 text-white font-medium">{s.name}</td>
                  <td className="px-5 py-4 text-[rgba(255,255,255,0.5)]">{s.email}</td>
                  <td className="px-5 py-4 text-[rgba(255,255,255,0.4)]">{s.church ?? "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {s.enrollments.length === 0
                        ? <span className="text-[rgba(255,255,255,0.25)] text-xs">Nenhum</span>
                        : s.enrollments.map(e => (
                          <span key={e.course.title} className="text-[10px] bg-[rgba(201,169,122,0.1)] text-[#C9A97A] px-2 py-0.5 rounded-full">{e.course.title}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[rgba(255,255,255,0.3)] text-xs">
                    {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/alunos/${s.id}`}>
                      <Button variant="ghost" size="sm">Ver</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
