import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET: 사용자의 진행 상태 조회
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const weekSlug = searchParams.get('weekSlug')

  const where = {
    userId: session.user.id,
    ...(weekSlug && { weekSlug }),
  }

  const progress = await prisma.progress.findMany({
    where,
    select: {
      taskId: true,
      weekSlug: true,
      completed: true,
      score: true,
      completedAt: true,
    },
  })

  return NextResponse.json({ progress })
}

// POST: 진행 상태 업데이트 (완료 토글)
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { taskId, weekSlug, completed, score } = await request.json()

  if (!taskId || !weekSlug) {
    return NextResponse.json({ error: 'taskId and weekSlug are required' }, { status: 400 })
  }

  const progress = await prisma.progress.upsert({
    where: {
      userId_taskId: {
        userId: session.user.id,
        taskId,
      },
    },
    update: {
      completed,
      score,
      completedAt: completed ? new Date() : null,
    },
    create: {
      userId: session.user.id,
      taskId,
      weekSlug,
      completed,
      score,
      completedAt: completed ? new Date() : null,
    },
  })

  return NextResponse.json({ progress })
}
