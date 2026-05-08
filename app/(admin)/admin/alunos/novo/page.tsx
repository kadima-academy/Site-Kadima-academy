"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NovoAlunoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", church: "" });

  useEffect(() => {
    fetch("/api/courses").then(r => r.json()).then(setCourses);
  }, []);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function toggleCourse(id: string) {
    setSelectedCourses(s => s.includes(id) ? s.filter(c => c !== id) : [...s, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, courseIds: selectedCourses }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Erro ao cadastrar."); setLoading(false); return; }
    router.push("/admin/alunos");
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/alunos" className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.35)] hover:text-[#C9A97A] mb-8 tracking-wide transition-colors">
        <ArrowLeft size={13} /> Voltar
      </Link>
      <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Novo</p>
      <h1 className="text-2xl font-semibold text-white tracking-wide mb-8">Cadastrar Aluno</h1>

      <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-8"
        style={{ background: "rgba(15,26,61,0.5)" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input id="name" label="Nome completo *" placeholder="Nome do aluno" value={form.name} onChange={e => set("name", e.target.value)} required />
          <Input id="email" type="email" label="E-mail *" placeholder="email@exemplo.com" value={form.email} onChange={e => set("email", e.target.value)} required />
          <Input id="password" type="text" label="Senha *" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => set("password", e.target.value)} required />
          <Input id="phone" label="Telefone" placeholder="(21) 99999-9999" value={form.phone} onChange={e => set("phone", e.target.value)} />
          <Input id="church" label="Igreja / Organização" placeholder="Nome da igreja" value={form.church} onChange={e => set("church", e.target.value)} />

          {courses.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-[rgba(255,255,255,0.5)] mb-3">Matricular em</p>
              <div className="flex flex-col gap-2">
                {courses.map(c => (
                  <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedCourses.includes(c.id)} onChange={() => toggleCourse(c.id)}
                      className="w-4 h-4 accent-[#C9A97A] rounded" />
                    <span className="text-sm text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors">{c.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Cadastrar</Button>
            <Link href="/admin/alunos"><Button type="button" variant="ghost">Cancelar</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
