import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  church: z.string().optional(),
  active: z.boolean().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { studentId } = await params;

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              modules: {
                include: { lessons: { include: { progress: { where: { userId: studentId } } } } },
              },
            },
          },
        },
      },
    },
  });
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(student);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { studentId } = await params;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const student = await prisma.user.update({ where: { id: studentId }, data: parsed.data });
  return NextResponse.json(student);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ studentId: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { studentId } = await params;

  await prisma.user.delete({ where: { id: studentId } });
  return NextResponse.json({ ok: true });
}
