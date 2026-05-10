import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getYoutubeId } from "@/lib/utils";

export const revalidate = 0;

export default async function AulaDaSemanaPage() {
  const data = await prisma.weeklyLesson.findUnique({ where: { id: "weekly" } });
  const youtubeUrl = data?.youtubeUrl ?? "";
  const content = data?.content ?? null;
  const ytId = getYoutubeId(youtubeUrl);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Poppins:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #060D1F;
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
          color: #fff;
        }
        a { color: inherit; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #060D1F 0%, #0F1A3D 100%)" }}>

        {/* ── Header ── */}
        <header style={{
          borderBottom: "1px solid rgba(201,169,122,0.12)",
          background: "linear-gradient(135deg, rgba(201,169,122,0.04) 0%, transparent 60%)",
          padding: "0 24px",
        }}>
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(201,169,122,0.20), rgba(201,169,122,0.06))",
                border: "1px solid rgba(201,169,122,0.30)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(201,169,122,0.15)",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A97A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 15, letterSpacing: 4, color: "#fff" }}>KADIMA</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontWeight: 500, fontSize: 9, letterSpacing: 4, color: "#C9A97A", marginTop: -2 }}>ACADEMY</div>
              </div>
            </Link>

            {/* Live badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 999,
              background: "rgba(201,169,122,0.08)",
              border: "1px solid rgba(201,169,122,0.25)",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9A97A", boxShadow: "0 0 8px #C9A97A", display: "block", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#C9A97A" }}>
                Todas as Sextas · 19:30 · Ao Vivo
              </span>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 0" }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 3, height: 20, background: "linear-gradient(180deg, #E8D5A8, #C9A97A)", borderRadius: 2, boxShadow: "0 0 8px rgba(201,169,122,0.6)" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 10, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: "#C9A97A" }}>
              Gratuito para todos
            </span>
          </div>

          <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: 2, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
            Assista a Gravação<br />
            <span style={{ color: "#C9A97A" }}>da Semana</span>
          </h1>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
            Todo encontro fica disponível aqui gratuitamente. Compartilhe com amigos e familiares.
          </p>

          {/* Video */}
          {ytId ? (
            <div style={{
              borderRadius: 20, overflow: "hidden",
              aspectRatio: "16/9",
              border: "1px solid rgba(201,169,122,0.15)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.60), 0 0 0 1px rgba(201,169,122,0.08)",
              marginBottom: 40,
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                style={{ width: "100%", height: "100%", display: "block" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{
              borderRadius: 20, aspectRatio: "16/9",
              border: "1px dashed rgba(201,169,122,0.20)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
              marginBottom: 40,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,122,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>Nenhuma aula disponível no momento.</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>Volte toda sexta após 19:30</p>
            </div>
          )}

          {/* HTML Content */}
          {content && (
            <div style={{
              borderRadius: 16,
              background: "rgba(15,26,61,0.5)",
              border: "1px solid rgba(201,169,122,0.12)",
              overflow: "hidden",
              marginBottom: 40,
            }}>
              <div style={{
                padding: "11px 20px",
                borderBottom: "1px solid rgba(201,169,122,0.08)",
                background: "rgba(201,169,122,0.03)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ width: 3, height: 14, background: "#C9A97A", borderRadius: 2, boxShadow: "0 0 6px #C9A97A" }} />
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#C9A97A" }}>
                  Material da Aula
                </span>
              </div>
              <div
                className="prose-lesson"
                style={{ padding: "20px 24px", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontSize: 14 }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}

          {/* CTA */}
          <div style={{
            borderRadius: 20, padding: "28px 32px",
            background: "linear-gradient(135deg, rgba(201,169,122,0.08) 0%, rgba(201,169,122,0.03) 100%)",
            border: "1px solid rgba(201,169,122,0.18)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 20, flexWrap: "wrap",
            marginBottom: 48,
          }}>
            <div>
              <p style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 16, letterSpacing: 1, color: "#fff", marginBottom: 6 }}>
                Quer se aprofundar?
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                Acesse todos os cursos completos na Kadima Academy.
              </p>
            </div>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 12, textDecoration: "none",
              background: "linear-gradient(135deg, #C9A97A, #A07840)",
              color: "#060D1F", fontFamily: "'Cinzel',serif", fontWeight: 700,
              fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
              boxShadow: "0 4px 20px rgba(201,169,122,0.35)",
              flexShrink: 0,
            }}>
              Acessar Cursos
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
