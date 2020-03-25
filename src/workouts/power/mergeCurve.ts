// expects every element represent 1 second
export function getMergedCurve(firstCurve: number[], secondCurve: number[]): number[] {
  const longest: number[] = firstCurve.length > secondCurve.length ? firstCurve : secondCurve
  const shorter: number[] = firstCurve.length > secondCurve.length ? secondCurve : firstCurve

  const out: number[] = []
  longest.forEach((item, index) => {
    if (index > shorter.length - 1 || item > shorter[index]) {
      out.push(item)
    } else {
      out.push(shorter[index])
    }
  })
  return out
}

// expects every element represent 1 second
export function getSecondCurveBests(firstCurve: number[], secondCurve: number[]): (number | null)[] {
  const longest = firstCurve.length > secondCurve.length ? firstCurve.length : secondCurve.length
  const out: (number | null)[] = []
  for (let i = 0; i < longest; i++) {
    if (i < firstCurve.length) {
      const item1 = firstCurve[i]
      if (i < secondCurve.length) {
        const item2 = secondCurve[i]
        if (item2 > item1) {
          out.push(item2)
        } else {
          out.push(null)
        }
      } else {
        out.push(null)
      }
    } else {
      out.push(secondCurve[i])
    }
  }

  return out
}
