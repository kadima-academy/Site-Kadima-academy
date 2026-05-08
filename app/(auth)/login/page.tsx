"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(27,46,107,0.4) 0%, #060D1F 55%)"
      }}>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(rgba(201,169,122,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,122,0.022) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Cantos */}
      {[
        "top-8 left-8 border-t border-l",
        "top-8 right-8 border-t border-r",
        "bottom-8 left-8 border-b border-l",
        "bottom-8 right-8 border-b border-r",
      ].map((cls, i) => (
        <div key={i} className={`absolute w-10 h-10 border-[rgba(201,169,122,0.2)] ${cls}`} />
      ))}

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo-nova.png"
            alt="Kadima Academy"
            width={100}
            height={100}
            className="mb-6"
            style={{ filter: "drop-shadow(0 0 30px rgba(201,169,122,0.4))" }}
          />
          <div className="w-16 h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, #C9A97A, transparent)" }} />
          <h1 className="font-serif text-xl tracking-[8px] uppercase text-white">Kadima Academy</h1>
          <p className="font-serif italic text-sm text-[#C9A97A] mt-1 tracking-wide">Escola Teológica Online</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[rgba(201,169,122,0.15)] p-8"
          style={{ background: "rgba(6,13,31,0.85)", backdropFilter: "blur(12px)" }}>
          <p className="text-xs tracking-[3px] uppercase text-[rgba(255,255,255,0.35)] mb-6 text-center">Acesso à plataforma</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}
            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] tracking-widest uppercase text-[rgba(255,255,255,0.15)] mt-8">
          © {new Date().getFullYear()} Kadima Academy
        </p>
      </div>
    </div>
  );
}
