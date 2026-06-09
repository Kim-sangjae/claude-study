import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]{2,12}$/;

async function setNickname(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { nickname } = body as { nickname: unknown };

  if (typeof nickname !== 'string' || !NICKNAME_REGEX.test(nickname)) {
    return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { nickname } });
  if (existing && existing.id !== session.user.id) {
    return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { nickname },
  });

  return NextResponse.json({ ok: true });
}

export const POST = setNickname;
export const PATCH = setNickname;
