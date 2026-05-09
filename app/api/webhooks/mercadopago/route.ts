import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mercadopago";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP envia action "payment" quando um pagamento muda de status
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ ok: true });
    }

    const paymentId = String(body.data.id);
    const mpData = await mpPayment.get({ id: paymentId });

    const status = mpData.status; // approved | rejected | pending | cancelled
    const externalRef = mpData.external_reference; // "userId:courseId"

    if (!externalRef) return NextResponse.json({ ok: true });

    const [userId, courseId] = externalRef.split(":");
    if (!userId || !courseId) return NextResponse.json({ ok: true });

    // Atualiza o registro de pagamento
    await prisma.payment.updateMany({
      where: { userId, courseId, status: "pending" },
      data: {
        status: status ?? "pending",
        mpPaymentId: paymentId,
      },
    });

    // Se aprovado → cria matrícula automaticamente
    if (status === "approved") {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        create: { userId, courseId },
        update: {},
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/mp]", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
