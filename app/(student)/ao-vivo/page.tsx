import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import JitsiMeet from "@/components/student/jitsi-meet";
import { Video } from "lucide-react";

export default async function AoVivoPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[rgba(201,169,122,0.12)] flex items-center justify-center">
          <Video size={16} className="text-[#C9A97A]" />
        </div>
        <div>
          <p className="text-xs tracking-[3px] uppercase text-[#C9A97A]">Transmissão</p>
          <h1 className="text-lg font-semibold text-white">Aula ao Vivo</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-[rgba(255,255,255,0.4)]">Sala aberta</span>
        </div>
      </div>

      <JitsiMeet
        roomName="kadima-academy-ao-vivo"
        displayName={session.user.name ?? "Aluno"}
        email={session.user.email ?? ""}
      />
    </div>
  );
}
