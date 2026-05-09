"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)",
      position: "relative", overflow: "hidden",
    }}>

      {/* Bokeh */}
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", top: "-60px", left: "15%", background: "radial-gradient(circle, rgba(201,169,122,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: "-80px", right: "10%", background: "radial-gradient(circle, rgba(80,110,200,0.14) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", top: "40%", right: "25%", background: "radial-gradient(circle, rgba(232,213,168,0.08) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

      {/* Grid sutil */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(201,169,122,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,122,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Cantos decorativos */}
      {[
        { top: 24, left: 24, borderTop: "1px solid rgba(201,169,122,0.20)", borderLeft: "1px solid rgba(201,169,122,0.20)" },
        { top: 24, right: 24, borderTop: "1px solid rgba(201,169,122,0.20)", borderRight: "1px solid rgba(201,169,122,0.20)" },
        { bottom: 24, left: 24, borderBottom: "1px solid rgba(201,169,122,0.20)", borderLeft: "1px solid rgba(201,169,122,0.20)" },
        { bottom: 24, right: 24, borderBottom: "1px solid rgba(201,169,122,0.20)", borderRight: "1px solid rgba(201,169,122,0.20)" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 40, height: 40, ...s }} />
      ))}

      {/* Conteúdo */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 400, margin: "0 24px" }}>

        {/* Logo + título */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 36 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 28, marginBottom: 20,
            background: "linear-gradient(135deg, rgba(201,169,122,0.12), rgba(201,169,122,0.04))",
            border: "1px solid rgba(201,169,122,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 40px rgba(201,169,122,0.20), 0 8px 32px rgba(0,0,0,0.40)",
          }}>
            <Image src="/logo-nova.png" alt="Kadima Academy" width={60} height={60}
              style={{ borderRadius: "50%", objectFit: "contain" }} />
          </div>

          <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 22, letterSpacing: 8, color: "var(--text-primary)", marginBottom: 6, textAlign: "center", textShadow: "0 2px 20px rgba(201,169,122,0.30)" }}>
            KADIMA
          </h1>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 400, fontSize: 11, letterSpacing: 6, color: "var(--gold)", textTransform: "uppercase" }}>
            Academy
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,122,0.50))" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 400, letterSpacing: 4, color: "rgba(201,169,122,0.50)", textTransform: "uppercase" }}>
              Escola Teológica Online
            </span>
            <span style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(201,169,122,0.50), transparent)" }} />
          </div>
        </div>

        {/* Card do formulário */}
        <div style={{
          borderRadius: 24,
          background: "linear-gradient(160deg, rgba(11,17,40,0.92) 0%, rgba(15,24,55,0.92) 100%)",
          border: "1px solid rgba(201,169,122,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.50), 0 0 0 1px rgba(201,169,122,0.05)",
          overflow: "hidden",
        }}>
          {/* Topo do card */}
          <div style={{
            padding: "14px 28px",
            borderBottom: "1px solid rgba(201,169,122,0.08)",
            background: "rgba(201,169,122,0.025)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 6px var(--gold)", opacity: 0.7 }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,169,122,0.60)" }}>
              Acesso à Plataforma
            </span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 6px var(--gold)", opacity: 0.7 }} />
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
            {/* E-mail */}
            <div>
              <label style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 8 }}>
                E-mail
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(201,169,122,0.40)", pointerEvents: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  style={{
                    width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${error ? "rgba(230,57,70,0.40)" : "rgba(201,169,122,0.18)"}`,
                    borderRadius: 12, fontSize: 13, color: "var(--text-primary)",
                    outline: "none", fontFamily: "'Poppins',sans-serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(201,169,122,0.50)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor = error ? "rgba(230,57,70,0.40)" : "rgba(201,169,122,0.18)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 8 }}>
                Senha
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(201,169,122,0.40)", pointerEvents: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%", paddingLeft: 40, paddingRight: 44, paddingTop: 12, paddingBottom: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${error ? "rgba(230,57,70,0.40)" : "rgba(201,169,122,0.18)"}`,
                    borderRadius: 12, fontSize: 13, color: "var(--text-primary)",
                    outline: "none", fontFamily: "'Poppins',sans-serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(201,169,122,0.50)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.target.style.borderColor = error ? "rgba(230,57,70,0.40)" : "rgba(201,169,122,0.18)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 4,
                    color: "rgba(201,169,122,0.35)", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(201,169,122,0.70)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,122,0.35)")}
                >
                  {showPassword ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                borderRadius: 10, background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.25)",
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF8088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 12, color: "#FF8088", fontFamily: "'Poppins',sans-serif" }}>{error}</span>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              style={{
                marginTop: 4, padding: "13px 24px", borderRadius: 14, cursor: "pointer",
                background: loading || !email.trim() || !password.trim()
                  ? "rgba(201,169,122,0.25)"
                  : "linear-gradient(135deg, var(--gold), var(--gold-deep))",
                color: loading || !email.trim() || !password.trim() ? "rgba(201,169,122,0.50)" : "var(--navy-darkest)",
                fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 12,
                letterSpacing: 3, textTransform: "uppercase", border: "none",
                boxShadow: loading || !email.trim() || !password.trim() ? "none" : "0 6px 24px rgba(201,169,122,0.35)",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%",
              }}
            >
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Acessar Plataforma
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <p style={{ textAlign: "center", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.12)", marginTop: 28, fontFamily: "'Cinzel',serif" }}>
          © {new Date().getFullYear()} Kadima Academy
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.18); }
      `}</style>
    </div>
  );
}
