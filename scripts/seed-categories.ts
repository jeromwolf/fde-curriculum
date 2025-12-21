/**
 * 커뮤니티 카테고리 시드 스크립트
 * 실행: npx tsx scripts/seed-categories.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    name: 'question',
    displayName: '질문',
    description: '학습 중 궁금한 점을 물어보세요',
    color: '#3B82F6', // blue
    order: 1,
  },
  {
    name: 'discussion',
    displayName: '자유 토론',
    description: '자유로운 주제로 토론해보세요',
    color: '#10B981', // green
    order: 2,
  },
  {
    name: 'project',
    displayName: '프로젝트 모집',
    description: '함께할 팀원을 찾아보세요',
    color: '#8B5CF6', // purple
    order: 3,
  },
  {
    name: 'showcase',
    displayName: '작품 공유',
    description: '본인의 프로젝트나 학습 결과물을 공유하세요',
    color: '#F59E0B', // amber
    order: 4,
  },
  {
    name: 'job',
    displayName: '채용/구직',
    description: 'FDE 관련 채용 정보를 공유하세요',
    color: '#EF4444', // red
    order: 5,
  },
  {
    name: 'resource',
    displayName: '자료 공유',
    description: '유용한 학습 자료를 공유하세요',
    color: '#06B6D4', // cyan
    order: 6,
  },
]

async function main() {
  console.log('Seeding categories...')

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        displayName: category.displayName,
        description: category.description,
        color: category.color,
        order: category.order,
      },
      create: category,
    })
    console.log(`  Created/Updated: ${category.displayName}`)
  }

  console.log('\nDone! Categories seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
