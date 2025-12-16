// Phase별 색상
export const phaseColors: Record<number, { primary: string; light: string; text: string }> = {
  1: { primary: '#3B82F6', light: '#EFF6FF', text: '#1E40AF' },
  2: { primary: '#10B981', light: '#ECFDF5', text: '#047857' },
  3: { primary: '#8B5CF6', light: '#F5F3FF', text: '#6D28D9' },
  4: { primary: '#F59E0B', light: '#FFFBEB', text: '#B45309' },
  5: { primary: '#EC4899', light: '#FDF2F8', text: '#BE185D' },
  6: { primary: '#06B6D4', light: '#ECFEFF', text: '#0E7490' },
}

export const getPhaseColors = (phase: number) => phaseColors[phase] || phaseColors[3]
