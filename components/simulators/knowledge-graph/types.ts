// Knowledge Graph 타입 정의

export interface Triple {
  id?: string
  subject: string
  predicate: string
  object: string
  confidence: number
  validatedBy?: 'baseline' | 'gpt' | 'user'
  sourceUrl?: string
}

export interface GraphNode {
  id: string
  label: string
  type: 'entity' | 'class' | 'literal'
  connections: number
  color?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  confidence: number
  color: string
  width: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GraphStats {
  totalTriples: number
  filteredTriples: number
  avgConfidence: number
  uniqueSubjects: number
  uniquePredicates: number
  uniqueObjects: number
}

export interface GraphFilters {
  minConfidence: number
  selectedPredicates: string[]
  searchTerm: string
}

export type ViewMode = '2d' | '3d'

// 관계 유형별 색상 정의
export const PREDICATE_COLORS: Record<string, { color: string; highlight: string; label: string }> = {
  competes_with: { color: '#EF4444', highlight: '#DC2626', label: '경쟁' },
  supplies_to: { color: '#10B981', highlight: '#059669', label: '공급' },
  partners_with: { color: '#3B82F6', highlight: '#2563EB', label: '협력' },
  influences: { color: '#F59E0B', highlight: '#D97706', label: '영향' },
  depends_on: { color: '#8B5CF6', highlight: '#7C3AED', label: '의존' },
  type: { color: '#6366F1', highlight: '#4F46E5', label: '타입' },
  locatedIn: { color: '#14B8A6', highlight: '#0D9488', label: '위치' },
  knows: { color: '#3B82F6', highlight: '#2563EB', label: '인맥' },
  marriedTo: { color: '#EC4899', highlight: '#DB2777', label: '결혼' },
  teaches: { color: '#F97316', highlight: '#EA580C', label: '강의' },
  enrolledIn: { color: '#84CC16', highlight: '#65A30D', label: '수강' },
  default: { color: '#6B7280', highlight: '#4B5563', label: '기타' },
}

// 회사명 매핑
export const COMPANY_NAME_MAP: Record<string, string> = {
  Samsung: '삼성전자',
  SKHynix: 'SK하이닉스',
  TSMC: 'TSMC',
  Intel: '인텔',
  Qualcomm: '퀄컴',
  Apple: '애플',
  LGChem: 'LG화학',
  Tesla: '테슬라',
  Nvidia: '엔비디아',
  AMD: 'AMD',
  Micron: '마이크론',
  Google: '구글',
  Microsoft: '마이크로소프트',
  Amazon: '아마존',
  Meta: '메타',
}
