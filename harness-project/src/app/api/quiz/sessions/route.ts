import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { UserAnswer } from '@/types';

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as {
    category: string;
    questionIds: string[];
    answers: UserAnswer[];
  };
  const { category, questionIds, answers } = body;

  const dbQuestions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, answer: true },
  });

  let score = 0;
  for (const q of dbQuestions) {
    const ua = answers.find((a) => a.questionId === q.id);
    if (ua && ua.selected === q.answer) score++;
  }

  const session = await prisma.quizSession.create({
    data: {
      userId: user.id,
      category,
      questionIds: questionIds as unknown as Prisma.InputJsonValue,
      answers: answers as unknown as Prisma.InputJsonValue,
      score,
    },
  });

  return NextResponse.json({ sessionId: session.id });
}

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await prisma.quizSession.findMany({
    where: { userId: user.id },
    orderBy: { submittedAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ sessions });
}
