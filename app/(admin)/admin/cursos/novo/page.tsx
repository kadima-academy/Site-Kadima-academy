"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", thumbnail: "" });

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error?.fieldErrors?.title?.[0] ?? "Erro ao criar curso."); setLoading(false); return; }
    router.push(`/admin/cursos/${data.id}`);
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/cursos" className="inline-flex items-center gap-2 text-xs text-[rgba(255,255,255,0.35)] hover:text-[#C9A97A] mb-8 tracking-wide transition-colors">
        <ArrowLeft size={13} /> Voltar
      </Link>
      <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Novo</p>
      <h1 className="text-2xl font-semibold text-white tracking-wide mb-8">Criar Curso</h1>

      <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-8"
        style={{ background: "rgba(15,26,61,0.5)" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input id="title" label="Título do curso *" placeholder="Ex: Teologia Sistemática" value={form.title}
            onChange={e => set("title", e.target.value)} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-[rgba(255,255,255,0.5)]">Descrição</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Descrição do curso..."
              className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,122,0.2)] rounded-lg px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.25)] outline-none resize-none h-24 focus:border-[rgba(201,169,122,0.55)] transition-all" />
          </div>

          <Input id="thumbnail" label="URL da Imagem de Capa" placeholder="https://..." value={form.thumbnail}
            onChange={e => set("thumbnail", e.target.value)} />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>Criar Curso</Button>
            <Link href="/admin/cursos"><Button type="button" variant="ghost">Cancelar</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
