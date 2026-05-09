"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: any;
  }
}

type LiveSession = { id: string; title: string; roomName: string; active: boolean; createdAt: string } | null;

function AdminJitsiRoom({ roomName }: { roomName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiRef = useRef<any>(null);

  useEffect(() => {
    const existing = document.querySelector('script[src="https://meet.jit.si/external_api.js"]');
    const init = () => {
      if (!containerRef.current || apiRef.current) return;
      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        userInfo: { displayName: "Professor (Admin)" },
        height: "100%",
        width: "100%",
        configOverwrite: {
          startWithAudioMuted: true,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          requireDisplayName: false,
          enableLobbyChat: false,
          lobby: { autoKnock: false, enableChat: false },
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "desktop", "fullscreen",
            "fodeviceselection", "hangup", "chat", "raisehand",
            "tileview", "select-background", "security",
          ],
        },
      });
    };

    if (existing && window.JitsiMeetExternalAPI) {
      init();
    } else if (!existing) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    } else {
      // script tag exists but API not loaded yet — wait
      const interval = setInterval(() => {
        if (window.JitsiMeetExternalAPI) { clearInterval(interval); init(); }
      }, 200);
      return () => clearInterval(interval);
    }

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [roomName]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: 520, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(52,211,153,0.15)" }}
    />
  );
}

export default function LiveControls({ activeSession }: { activeSession: LiveSession }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [roomName, setRoomName] = useState("");
  const [session, setSession] = useState(activeSession);
  const [showRoom, setShowRoom] = useState(false);

  async function createSession(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch("/api/live/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, roomName }),
    });
    const data = await res.json();
    if (res.ok) {
      setSession(data);
      setShowRoom(true);
      setTitle("");
      setRoomName("");
      router.refresh();
    }
    setLoading(false);
  }

  async function endSession() {
    if (!confirm("Encerrar a transmissão atual?")) return;
    setLoading(true);
    await fetch("/api/live/session", { method: "DELETE" });
    setSession(null);
    setShowRoom(false);
    router.refresh();
    setLoading(false);
  }

  /* ── Sessão ativa ── */
  if (session?.active) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{
          borderRadius: 20, overflow: "hidden",
          background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
          border: "1px solid rgba(52,211,153,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(52,211,153,0.10)",
        }}>
          {/* Status bar */}
          <div style={{
            padding: "12px 24px",
            background: "rgba(52,211,153,0.08)",
            borderBottom: "1px solid rgba(52,211,153,0.15)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", flexShrink: 0, animation: "live-pulse 1.5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#6ee7b7" }}>
              Transmissão Ativa
            </span>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", marginBottom: 6 }}>
                {session.title}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Sala: <code style={{ color: "var(--gold)", fontSize: 11 }}>{session.roomName}</code>
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Iniciada: {new Date(session.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => setShowRoom(v => !v)}
                style={{
                  padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                  background: showRoom
                    ? "rgba(52,211,153,0.15)"
                    : "linear-gradient(135deg, var(--gold), var(--gold-deep))",
                  color: showRoom ? "#6ee7b7" : "var(--navy-darkest)",
                  fontFamily: "'Cinzel',serif",
                  fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                  boxShadow: showRoom ? "none" : "0 4px 16px rgba(201,169,122,0.30)",
                  display: "flex", alignItems: "center", gap: 7,
                  border: showRoom ? "1px solid rgba(52,211,153,0.30)" : "none",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/>
                </svg>
                {showRoom ? "Ocultar Sala" : "Entrar na Sala"}
              </button>
              <button
                onClick={endSession}
                disabled={loading}
                style={{
                  padding: "9px 18px", borderRadius: 10, cursor: "pointer",
                  background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.30)",
                  color: "#FF8088", fontFamily: "'Cinzel',serif",
                  fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
              >
                Encerrar
              </button>
            </div>
          </div>

          {/* Embedded Jitsi room for admin */}
          {showRoom && (
            <div style={{ padding: "0 24px 24px" }}>
              <AdminJitsiRoom roomName={session.roomName} />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Nenhuma sessão ativa — formulário de criação ── */
  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(160deg, var(--navy-card) 0%, var(--navy-card-2) 100%)",
      border: "1px solid rgba(201,169,122,0.12)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      marginBottom: 28,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 24px",
        borderBottom: "1px solid rgba(201,169,122,0.10)",
        background: "rgba(201,169,122,0.03)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ width: 3, height: 16, background: "linear-gradient(180deg, var(--gold-light), var(--gold))", borderRadius: 2, boxShadow: "0 0 8px var(--gold)" }} />
        <span style={{ fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-primary)" }}>
          Abrir Nova Transmissão
        </span>
      </div>

      <form onSubmit={createSession} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 7 }}>
            Título da transmissão *
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Aula Ao Vivo — Módulo 3"
            required
            style={{
              width: "100%", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(201,169,122,0.20)", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, color: "var(--text-primary)",
              outline: "none", fontFamily: "'Poppins',sans-serif",
            }}
          />
        </div>

        <div>
          <label style={{ fontFamily: "'Cinzel',serif", fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 7 }}>
            Nome da sala <span style={{ color: "var(--text-muted)", fontFamily: "'Poppins',sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "none", fontWeight: 400 }}>(opcional — gerado automaticamente)</span>
          </label>
          <input
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder="Ex: kadima-teologia-2026 (espaços viram hífens automaticamente)"
            style={{
              width: "100%", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(201,169,122,0.12)", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, color: "var(--text-primary)",
              outline: "none", fontFamily: "'Poppins',sans-serif",
            }}
          />
        </div>

        <div style={{ paddingTop: 4 }}>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            style={{
              padding: "11px 28px", borderRadius: 12, cursor: "pointer",
              background: "linear-gradient(135deg, var(--gold), var(--gold-deep))",
              color: "var(--navy-darkest)", fontFamily: "'Cinzel',serif",
              fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
              border: "none", boxShadow: "0 4px 16px rgba(201,169,122,0.35)",
              opacity: loading || !title.trim() ? 0.6 : 1,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/>
            </svg>
            {loading ? "Abrindo..." : "Iniciar Transmissão"}
          </button>
        </div>
      </form>
    </div>
  );
}
