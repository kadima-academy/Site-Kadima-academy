import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminAoVivoPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const records = await prisma.liveAttendance.findMany({
    orderBy: [{ date: "desc" }, { joinedAt: "asc" }],
    include: { user: { select: { name: true, email: true, church: true } } },
  });

  const byDate = records.reduce<Record<string, typeof records>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ minHeight: "100%", background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)" }}>

      {/* Header */}
      <div className="ka-live-header">
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: "linear-gradient(135deg, rgba(230,57,70,0.20), rgba(230,57,70,0.08))",
          border: "1px solid rgba(230,57,70,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(230,57,70,0.20)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8088" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="ka-page-eyebrow" style={{ marginBottom: 4 }}>Transmissões</div>
          <h1 className="ka-page-title" style={{ fontSize: 22 }}>
            Controle de <span>Presença</span>
          </h1>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(201,169,122,0.06)", border: "1px solid rgba(201,169,122,0.15)",
          padding: "8px 16px", borderRadius: 12,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", fontFamily: "'Cinzel',serif" }}>
            {records.length} registro{records.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div style={{ padding: "28px 44px 44px" }}>
        {dates.length === 0 ? (
          <div style={{
            borderRadius: 20, padding: "56px 32px", textAlign: "center", maxWidth: 380,
            background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
            border: "1px solid rgba(201,169,122,0.12)",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "rgba(201,169,122,0.25)", margin: "0 auto 16px", display: "block" }}>
              <rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/>
            </svg>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Nenhuma presença registrada</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>As presenças aparecerão aqui após as transmissões ao vivo.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {dates.map((date) => {
              const attendees = byDate[date];
              const [year, month, day] = date.split("-");
              const label = `${day}/${month}/${year}`;

              return (
                <div key={date} style={{
                  borderRadius: 20, overflow: "hidden",
                  background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
                  border: "1px solid rgba(201,169,122,0.12)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}>
                  {/* Date header */}
                  <div style={{
                    padding: "14px 22px",
                    borderBottom: "1px solid rgba(201,169,122,0.10)",
                    background: "rgba(201,169,122,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 3, height: 14, background: "linear-gradient(180deg, var(--gold-light), var(--gold))", borderRadius: 2, boxShadow: "0 0 6px var(--gold)" }} />
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span style={{ fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--text-primary)" }}>{label}</span>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 2,
                      background: "rgba(201,169,122,0.10)", border: "1px solid var(--gold-20)",
                      color: "var(--gold)", padding: "3px 10px", borderRadius: 999,
                      fontFamily: "'Cinzel',serif",
                    }}>
                      {attendees.length} presença{attendees.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Attendee list */}
                  {attendees.map((r, i) => (
                    <div key={r.id} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "12px 22px",
                      borderTop: i > 0 ? "1px solid rgba(201,169,122,0.06)" : "none",
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(201,169,122,0.40)", width: 20, flexShrink: 0, fontFamily: "'Cinzel',serif" }}>
                        {i + 1}
                      </span>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "radial-gradient(circle at 30% 30%, var(--gold-bright), var(--gold) 50%, var(--gold-deep))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 11,
                        color: "var(--navy-darkest)",
                        boxShadow: "0 0 10px rgba(201,169,122,0.25)",
                      }}>
                        {r.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.user.name}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.user.email}
                        </p>
                      </div>
                      {r.user.church && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, letterSpacing: 1,
                          background: "rgba(201,169,122,0.08)", border: "1px solid var(--gold-20)",
                          color: "var(--gold)", padding: "3px 10px", borderRadius: 999, flexShrink: 0,
                        }}>
                          {r.user.church}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                        {new Date(r.joinedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
