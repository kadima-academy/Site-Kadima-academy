import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getYoutubeId, getGoogleDriveImageUrl } from "@/lib/utils";
import CourseThumbnail from "@/components/student/course-thumbnail";

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) return null;
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { progress: { where: { userId: session.user.id } } },
          },
        },
      },
    },
  });
  if (!course) notFound();

  const allLessons = course.modules.flatMap(m => m.lessons);
  const done = allLessons.filter(l => l.progress[0]?.completed).length;
  const total = allLessons.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextLesson = allLessons.find(l => !l.progress[0]?.completed) ?? allLessons[0];
  const thumbnailUrl = course.thumbnail?.includes("drive.google.com")
    ? getGoogleDriveImageUrl(course.thumbnail)
    : course.thumbnail;

  return (
    <div style={{ minHeight: "100%", background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)" }}>

      {/* Back */}
      <Link href="/cursos" className="ka-back-link">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Meus Cursos
      </Link>

      {/* Course Hero */}
      <div style={{
        margin: "16px 44px 0",
        borderRadius: 24,
        overflow: "hidden",
        background: "linear-gradient(135deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
        border: "1px solid rgba(201,169,122,0.14)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        display: "flex",
        gap: 0,
      }}>
        {/* Thumbnail strip */}
        <div style={{
          width: 180, flexShrink: 0,
          background: "linear-gradient(140deg, #0A1129, #14215A)",
          position: "relative", overflow: "hidden",
        }}>
          {thumbnailUrl && <CourseThumbnail src={thumbnailUrl} alt={course.title} />}
          {!thumbnailUrl && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(201,169,122,0.20)" }}>
                <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0 0 5H20"/>
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: "28px 32px" }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, fontWeight: 500, letterSpacing: 5, textTransform: "uppercase", color: "var(--gold)", marginBottom: 10 }}>
            Curso
          </div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 22, letterSpacing: 2, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 8 }}>
            {course.title}
          </h1>
          {course.description && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20, maxWidth: 480 }}>
              {course.description}
            </p>
          )}

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, maxWidth: 240 }}>
              <div className="ka-progress-bar">
                <div className="ka-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold-light)", fontFamily: "'Cinzel',serif" }}>
              {pct}%
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {done}/{total} aulas
            </span>
          </div>

          {/* Continue button */}
          {nextLesson && (
            <Link href={`/cursos/${course.slug}/aula/${nextLesson.id}`} className="ka-continue-btn" style={{ maxWidth: 240, display: "inline-flex" }}>
              {pct === 0 ? "Começar Curso" : pct === 100 ? "Rever Curso" : "Continuar"}
              <span>→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Module list */}
      <div style={{ padding: "32px 44px 44px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 3, height: 18, background: "linear-gradient(180deg, var(--gold-light), var(--gold))", borderRadius: 2, boxShadow: "0 0 8px var(--gold)" }} />
          <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: 14, letterSpacing: 4, color: "var(--text-primary)", textTransform: "uppercase" }}>
            Conteúdo do Curso
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {course.modules.map((mod, mi) => {
            const modDone = mod.lessons.filter(l => l.progress[0]?.completed).length;
            const modTotal = mod.lessons.length;
            const modPct = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;
            return (
              <div key={mod.id} style={{
                borderRadius: 16, overflow: "hidden",
                background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
                border: "1px solid rgba(201,169,122,0.10)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}>
                {/* Module header */}
                <div style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(201,169,122,0.08)",
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(201,169,122,0.03)",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(201,169,122,0.18), rgba(201,169,122,0.06))",
                    border: "1px solid var(--gold-20)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11,
                    color: "var(--gold-light)",
                  }}>
                    {mi + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cinzel',serif", fontWeight: 600, fontSize: 12, letterSpacing: 1.5, color: "var(--text-primary)", textTransform: "uppercase" }}>
                      {mod.title}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {modDone}/{modTotal} aulas · {modPct}%
                    </p>
                  </div>
                  {modDone === modTotal && modTotal > 0 && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                      background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.25)",
                      color: "#6ee7b7", padding: "3px 8px", borderRadius: 999,
                    }}>
                      ✓ Completo
                    </span>
                  )}
                </div>

                {/* Lesson rows */}
                <div>
                  {mod.lessons.map((lesson, li) => {
                    const ytId = getYoutubeId(lesson.youtubeUrl);
                    const completed = lesson.progress[0]?.completed;
                    return (
                      <Link key={lesson.id} href={`/cursos/${slug}/aula/${lesson.id}`}
                        style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "12px 20px",
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        className="lesson-row">
                        {ytId
                          ? <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
                              style={{ width: 72, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0, opacity: 0.85, border: "1px solid rgba(201,169,122,0.10)" }} />
                          : <div style={{
                              width: 72, height: 44, borderRadius: 8, flexShrink: 0,
                              background: "rgba(27,46,107,0.5)", border: "1px solid rgba(201,169,122,0.08)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "rgba(201,169,122,0.35)" }}>
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Poppins',sans-serif" }}>
                            <span style={{ color: "var(--gold)", fontSize: 11, fontWeight: 700, marginRight: 6 }}>{li + 1}.</span>
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{lesson.duration}</p>
                          )}
                        </div>
                        {completed ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,122,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10"/>
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
