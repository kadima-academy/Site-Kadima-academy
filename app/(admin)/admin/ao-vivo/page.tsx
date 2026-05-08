import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Video, Users, Calendar } from "lucide-react";

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
    <div>
      <div className="mb-8">
        <p className="text-[11px] tracking-[5px] uppercase text-[#C9A97A] mb-2 font-medium">Transmissões</p>
        <h1 className="text-3xl font-bold text-white">Controle de Presença</h1>
      </div>

      {dates.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(15,26,61,0.4)", border: "1px solid rgba(201,169,122,0.1)" }}>
          <Video size={32} className="text-[rgba(201,169,122,0.3)] mx-auto mb-3" />
          <p className="text-[rgba(255,255,255,0.4)] text-sm">Nenhuma presença registrada ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {dates.map((date) => {
            const attendees = byDate[date];
            const [year, month, day] = date.split("-");
            const label = `${day}/${month}/${year}`;

            return (
              <div key={date} className="rounded-2xl overflow-hidden" style={{ background: "rgba(15,26,61,0.4)", border: "1px solid rgba(201,169,122,0.1)" }}>
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(201,169,122,0.08)", background: "rgba(201,169,122,0.03)" }}>
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-[#C9A97A]" />
                    <span className="text-sm font-semibold text-white">{label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.4)]">
                    <Users size={12} />
                    {attendees.length} presente{attendees.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Table */}
                <div className="divide-y divide-[rgba(201,169,122,0.06)]">
                  {attendees.map((r, i) => (
                    <div key={r.id} className="flex items-center gap-4 px-6 py-3">
                      <span className="text-xs text-[rgba(201,169,122,0.4)] w-5 font-bold">{i + 1}</span>
                      <div className="w-7 h-7 rounded-full bg-[rgba(201,169,122,0.12)] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#C9A97A]">
                          {r.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{r.user.name}</p>
                        <p className="text-[11px] text-[rgba(255,255,255,0.3)] truncate">{r.user.email}</p>
                      </div>
                      {r.user.church && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md shrink-0"
                          style={{ background: "rgba(201,169,122,0.08)", color: "rgba(201,169,122,0.7)", border: "1px solid rgba(201,169,122,0.12)" }}>
                          {r.user.church}
                        </span>
                      )}
                      <span className="text-[11px] text-[rgba(255,255,255,0.25)] shrink-0">
                        {new Date(r.joinedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
