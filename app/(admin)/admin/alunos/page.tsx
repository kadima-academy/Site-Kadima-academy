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
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[11px] tracking-[5px] uppercase text-[#C9A97A] mb-3 font-medium">Gestão</p>
          <h1 className="text-4xl font-bold text-white tracking-tight">Alunos</h1>
          <p className="text-base text-[rgba(255,255,255,0.4)] mt-2">{students.length} aluno(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/alunos/novo">
          <Button size="sm" className="gap-1.5">
            <Plus size={14} strokeWidth={2.5} />
            Cadastrar Aluno
          </Button>
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl p-16 text-center" style={{
          background: "rgba(15,26,61,0.3)",
          border: "1px solid rgba(201,169,122,0.1)",
        }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(201,169,122,0.08)", border: "1px solid rgba(201,169,122,0.12)" }}>
            <Users size={28} className="text-[rgba(201,169,122,0.4)]" />
          </div>
          <p className="text-[rgba(255,255,255,0.5)] text-sm mb-1">Nenhum aluno cadastrado</p>
          <p className="text-[rgba(255,255,255,0.25)] text-xs">Cadastre o primeiro aluno da plataforma</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{
          background: "rgba(10,18,45,0.6)",
          border: "1px solid rgba(201,169,122,0.1)",
        }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(201,169,122,0.08)", background: "rgba(201,169,122,0.03)" }}>
                {["Aluno", "E-mail", "Igreja", "Cursos", "Cadastro", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] tracking-[2px] uppercase text-[rgba(255,255,255,0.3)] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const initials = s.name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
                return (
                  <tr key={s.id}
                    className="hover:bg-[rgba(255,255,255,0.025)] transition-colors"
                    style={{ borderBottom: i < students.length - 1 ? "1px solid rgba(201,169,122,0.05)" : "none" }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-[#060D1F] shrink-0"
                          style={{ background: "linear-gradient(135deg, #D4B483, #B8924A)" }}>
                          {initials}
                        </div>
                        <span className="font-medium text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[rgba(255,255,255,0.45)] text-[13px]">{s.email}</td>
                    <td className="px-5 py-4 text-[rgba(255,255,255,0.35)] text-[13px]">{s.church ?? "—"}</td>
                    <td className="px-5 py-4">
                      {s.enrollments.length === 0
                        ? <span className="text-[rgba(255,255,255,0.2)] text-xs">Nenhum</span>
                        : (
                          <div className="flex flex-wrap gap-1">
                            {s.enrollments.map(e => (
                              <span key={e.course.title}
                                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ background: "rgba(201,169,122,0.1)", border: "1px solid rgba(201,169,122,0.2)", color: "#C9A97A" }}>
                                {e.course.title}
                              </span>
                            ))}
                          </div>
                        )}
                    </td>
                    <td className="px-5 py-4 text-[rgba(255,255,255,0.3)] text-[12px]">
                      {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/alunos/${s.id}`}>
                        <Button variant="ghost" size="sm">Ver</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
