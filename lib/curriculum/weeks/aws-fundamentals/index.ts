// Phase 4, Week 1: AWS 기초
import type { Week } from '../../types'
import { day1 } from './day1'
import { day2 } from './day2'
import { day3 } from './day3'
import { day4 } from './day4'
import { day5 } from './day5'

export const awsFundamentalsWeek: Week = {
  slug: 'aws-fundamentals',
  week: 1,
  phase: 4,
  month: 7,
  access: 'pro',
  title: 'AWS 기초',
  topics: ['IAM', 'EC2', 'VPC', 'S3', 'Lambda', 'RDS', 'DynamoDB'],
  practice: '3-Tier 아키텍처 구축',
  totalDuration: 900,
  days: [day1, day2, day3, day4, day5]
}
