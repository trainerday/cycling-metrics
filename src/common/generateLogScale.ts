export function generateLogScale(logScale: number, timeLength: number) {
  const points = new Array<number>()
  let current = 1
  while (current < timeLength) {
    points.push(current)
    current = Math.ceil(current * logScale)
  }
  return points
}