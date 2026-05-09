import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import JitsiMeet from "@/components/student/jitsi-meet";

export default async function AoVivoPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ minHeight: "100%", background: "linear-gradient(180deg, var(--navy-darkest) 0%, var(--navy-mid) 100%)", display: "flex", flexDirection: "column" }}>

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
            <rect x="2" y="6" width="14" height="12" rx="2"/>
            <path d="M22 8l-6 4 6 4V8z"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="ka-page-eyebrow" style={{ marginBottom: 4 }}>Transmissão ao Vivo</div>
          <h1 className="ka-page-title" style={{ fontSize: 22 }}>
            Aula ao <span>Vivo</span>
          </h1>
        </div>
        <div className="ka-live-indicator">
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF8088", boxShadow: "0 0 6px #FF8088", flexShrink: 0 }} />
          AO VIVO
        </div>
      </div>

      {/* Player */}
      <div style={{ flex: 1, padding: "28px 44px 44px" }}>
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(201,169,122,0.12)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.50)",
          background: "#000",
        }}>
          <JitsiMeet
            roomName="kadima-academy-ao-vivo"
            displayName={session.user.name ?? "Aluno"}
            email={session.user.email ?? ""}
          />
        </div>

        {/* Info */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 4px var(--gold)", flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'Poppins',sans-serif", letterSpacing: 0.5 }}>
            Sala de transmissão Kadima Academy — interativa e ao vivo
          </p>
        </div>
      </div>
    </div>
  );
}
