"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div style={{ minHeight: "100%", background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)" }}>
      <Link href="/admin/alunos" className="ka-back-link">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Alunos
      </Link>

      <div className="ka-section" style={{ padding: "20px 44px 44px", maxWidth: 600 }}>
        <div className="ka-page-eyebrow" style={{ marginBottom: 6 }}>Novo</div>
        <h1 className="ka-page-title" style={{ fontSize: 24, marginBottom: 28 }}>
          Cadastrar <span>Aluno</span>
        </h1>

        <div style={{
          borderRadius: 20, padding: "32px",
          background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
          border: "1px solid rgba(201,169,122,0.14)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Input id="name" label="Nome completo *" placeholder="Nome do aluno" value={form.name} onChange={e => set("name", e.target.value)} required />
            <Input id="email" type="email" label="E-mail *" placeholder="email@exemplo.com" value={form.email} onChange={e => set("email", e.target.value)} required />
            <Input id="password" type="text" label="Senha *" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => set("password", e.target.value)} required />
            <Input id="phone" label="Telefone" placeholder="(21) 99999-9999" value={form.phone} onChange={e => set("phone", e.target.value)} />
            <Input id="church" label="Igreja / Organização" placeholder="Nome da igreja" value={form.church} onChange={e => set("church", e.target.value)} />

            {courses.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", marginBottom: 12 }}>
                  Matricular em
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {courses.map(c => (
                    <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={selectedCourses.includes(c.id)} onChange={() => toggleCourse(c.id)}
                        style={{ width: 16, height: 16, accentColor: "var(--gold)", borderRadius: 4 }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {error && <p style={{ fontSize: 12, color: "#f87171" }}>{error}</p>}

            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <Button type="submit" loading={loading}>Cadastrar</Button>
              <Link href="/admin/alunos"><Button type="button" variant="ghost">Cancelar</Button></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
