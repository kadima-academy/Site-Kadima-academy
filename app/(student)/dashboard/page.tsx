import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { getGoogleDriveImageUrl } from "@/lib/utils";
import CourseThumbnail from "@/components/student/course-thumbnail";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: { include: { progress: { where: { userId: session.user.id } } } },
            },
          },
        },
      },
    },
  });

  const firstName = session.user.name?.split(" ")[0] ?? "Aluno";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)" }}>

      {/* ── Hero ── */}
      <section className="ka-hero">
        {/* Bokeh blobs */}
        <div className="ka-bokeh" style={{ top: -30, left: "10%", width: 180, height: 180, background: "rgba(201,169,122,0.25)" }} />
        <div className="ka-bokeh" style={{ bottom: -50, right: "15%", width: 220, height: 220, background: "rgba(80,110,200,0.18)" }} />
        <div className="ka-bokeh" style={{ top: "40%", left: "60%", width: 140, height: 140, background: "rgba(232,213,168,0.15)" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" }}>
          {/* Logo */}
          <div className="ka-hero-logo">
            <Image src="/logo-nova.png" alt="Kadima Academy" width={68} height={68}
              style={{ borderRadius: "50%", objectFit: "contain", position: "relative", zIndex: 1 }} />
          </div>

          <h1 style={{
            fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 36,
            letterSpacing: 8, color: "var(--text-primary)", marginBottom: 14,
            textShadow: "0 2px 20px rgba(201,169,122,0.40)",
          }}>
            KADIMA ACADEMY
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 10 }}>
            <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, var(--gold) 50%, transparent)" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 500, fontSize: 11, letterSpacing: 5, color: "var(--gold-light)", textTransform: "uppercase" }}>
              Sua área de membros
            </span>
            <span style={{ width: 60, height: 1, background: "linear-gradient(90deg, var(--gold), transparent 50%, transparent)" }} />
          </div>

          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 300, color: "var(--text-secondary)", letterSpacing: 1 }}>
            Bem-vindo, <strong style={{ fontWeight: 600, color: "var(--gold-light)" }}>{firstName}</strong>
          </p>
        </div>
      </section>

      {/* ── Courses ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "38px 44px 44px" }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, rgba(201,169,122,0.20), rgba(201,169,122,0.05))",
            border: "1px solid var(--gold-35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--gold-light)",
            boxShadow: "0 0 14px rgba(201,169,122,0.18)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0 0 5H20"/>
              <path d="M8 7h8M8 11h6"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: 22, letterSpacing: 3, color: "var(--text-primary)", textTransform: "uppercase" }}>
            Meus <span style={{ color: "var(--gold-light)" }}>Cursos</span>
          </h2>
        </div>

        {enrollments.length === 0 ? (
          <div style={{
            borderRadius: 20, padding: "56px 32px", textAlign: "center", maxWidth: 380,
            background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
            border: "1px solid rgba(201,169,122,0.12)",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "rgba(201,169,122,0.25)", margin: "0 auto 16px", display: "block" }}>
              <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0 0 5H20"/>
            </svg>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Nenhum curso ainda</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>Entre em contato com a administração para se matricular.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {enrollments.map(({ course }) => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const done = allLessons.filter(l => l.progress[0]?.completed).length;
              const total = allLessons.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const nextLesson = allLessons.find(l => !l.progress[0]?.completed) ?? allLessons[0];
              const thumbnailUrl = course.thumbnail?.includes("drive.google.com")
                ? getGoogleDriveImageUrl(course.thumbnail)
                : course.thumbnail;
              const label = pct > 0 && pct < 100 ? "Continuar" : pct === 100 ? "Rever" : "Começar";

              return (
                <article key={course.id} className="ka-card">
                  {/* Thumbnail */}
                  <div className="ka-thumb">
                    {thumbnailUrl && <CourseThumbnail src={thumbnailUrl} alt={course.title} />}
                    {/* Placeholder icon (hidden when image loads) */}
                    <div className="ka-thumb-mark">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6.5C2 5.67 2.67 5 3.5 5H8c1.66 0 3 1.34 3 3v12c0-1.1-.9-2-2-2H3.5c-.83 0-1.5-.67-1.5-1.5v-10z"/>
                        <path d="M22 6.5C22 5.67 21.33 5 20.5 5H16c-1.66 0-3 1.34-3 3v12c0-1.1.9-2 2-2h5.5c.83 0 1.5-.67 1.5-1.5v-10z"/>
                      </svg>
                    </div>

                    <div className="ka-progress-badge">{pct}%</div>

                    {nextLesson && (
                      <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`} className="ka-play-overlay">
                        <div className="ka-play-circle">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 22px 22px" }}>
                    <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: 16, letterSpacing: 1.5, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                      {course.title}
                    </h3>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 4px var(--gold)", flexShrink: 0 }} />
                      {done}/{total} aula{total !== 1 ? "s" : ""} concluída{done !== 1 ? "s" : ""}
                    </div>

                    <div className="ka-progress-bar" style={{ marginBottom: 16 }}>
                      <div className="ka-progress-fill" style={{ width: `${pct}%` }} />
                    </div>

                    {nextLesson ? (
                      <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`} className="ka-continue-btn">
                        {label}
                        <span style={{ transition: "transform 0.2s" }}>→</span>
                      </Link>
                    ) : (
                      <Link href={`/cursos/${course.slug}`} className="ka-continue-btn">
                        Ver Curso →
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
