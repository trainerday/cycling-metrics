import { MeanMaxPower } from './models/meanMaxPower'
import { getPCurve } from './workout/power/meanMaxHelper'
export { getWorkoutStats } from './workout/metrics/workoutStatistics'
export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/clt'
export { getTrainingStressBalance } from './workouts/volume/tsb'

export const getMeanMaxPower = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  const curve = getPCurve(mmp.timePoints, mmp.timeLength, mmp.curvePoints)
  return curve
}




