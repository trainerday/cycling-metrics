import { getTimeType } from './getTimeType'

export function getWorkoutClassificationGroup(minutes: number, timeInZones: object): string {
  const timeType = getTimeType(minutes)
  let strOut = ''
  let strOut2 = ''
  for (const property in timeInZones) {
    if (property !== 'z1' && property !== 'z2') {
      // @ts-ignore
      strOut = `${strOut}_${getClosest(timeInZones[property])}`
    }
    // @ts-ignore
    strOut2 = `${strOut2}_${getClosest(timeInZones[property])}`
  }
  if (strOut === '_0_0_0_0_0') strOut = strOut2
  return (timeType + strOut).replace(' ', '_').toLowerCase()
}

function getClosest(goal: number): number {
  // minArr is just a way to find approximate times in minutes for simple grouping
  const minArr = [0, 0.1, 0.2, 0.5, 1, 2, 3, 5, 8, 11, 17, 26, 38, 58, 86, 130, 195, 292]
  const closest = minArr.reduce(function(prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  })
  return closest
}
