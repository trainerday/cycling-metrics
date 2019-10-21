export function getTimeType(minutes: number): string {
  if (minutes <= 30) return '30 Min'
  if (minutes <= 50) return '45 Min'
  if (minutes <= 65) return '60 Min'
  if (minutes <= 80) return '75 Min'
  if (minutes <= 100) return '90 Min'
  if (minutes <= 160) return '2 Hrs'
  return '3 Plus'
}
