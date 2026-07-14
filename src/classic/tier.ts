export function tierLabel(level: number): string {
  if (level >= 90) return 'Daily driver'
  if (level >= 80) return 'Production proven'
  if (level >= 70) return 'Comfortable'
  return 'Dusty(but functional)'
}
