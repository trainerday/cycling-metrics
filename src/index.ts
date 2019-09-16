import { MeanMaxPower } from './workout/power/meanMaxPower'
export { getWorkoutStats } from './workout/metrics/workoutStatistics'
export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/clt'
export { getTrainingStressBalance } from './workouts/volume/tsb'

export const getMeanMaxPower = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  return mmp.getPowerCurve
}




