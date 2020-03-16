import _ from 'lodash'

export function insertMissingElementsInSequence(seconds: number[], power: number[]): any {
  const secondsPower = _.zip(seconds, power)
  const out: number[] = []
  let lastSecond = 0
  secondsPower.forEach(item => {
    // @ts-ignore
    const difference = item[0] - lastSecond
    // @ts-ignore
    lastSecond = item[0]
    if (difference > 1) {
      for (let i = 0; i < difference - 1; i++) {
        out.push(0)
      }
    }
    // @ts-ignore
    out.push(item[1])
  })
  return out
}
