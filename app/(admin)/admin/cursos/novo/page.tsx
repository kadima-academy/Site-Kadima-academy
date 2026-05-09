"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div style={{ minHeight: "100%", background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)" }}>
      <Link href="/admin/cursos" className="ka-back-link">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Cursos
      </Link>

      <div style={{ padding: "20px 44px 44px", maxWidth: 600 }}>
        <div className="ka-page-eyebrow" style={{ marginBottom: 6 }}>Novo</div>
        <h1 className="ka-page-title" style={{ fontSize: 24, marginBottom: 28 }}>
          Criar <span>Curso</span>
        </h1>

        <div style={{
          borderRadius: 20, padding: "32px",
          background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
          border: "1px solid rgba(201,169,122,0.14)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Input id="title" label="Título do curso *" placeholder="Ex: Teologia Sistemática" value={form.title}
              onChange={e => set("title", e.target.value)} required />

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)" }}>
                Descrição
              </label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Descrição do curso..."
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,169,122,0.20)", borderRadius: 10,
                  padding: "12px 14px", fontSize: 13, color: "var(--text-primary)",
                  outline: "none", resize: "none", height: 96,
                  fontFamily: "'Poppins',sans-serif",
                }} />
            </div>

            <Input id="thumbnail" label="URL da Capa (800×1000px recomendado)" placeholder="https://..." value={form.thumbnail}
              onChange={e => set("thumbnail", e.target.value)} />

            {error && <p style={{ fontSize: 12, color: "#f87171" }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Button type="submit" loading={loading}>Criar Curso</Button>
              <Link href="/admin/cursos"><Button type="button" variant="ghost">Cancelar</Button></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
