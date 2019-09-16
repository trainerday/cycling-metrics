import { MeanMaxPower } from './models/meanMaxPower'
import { getPowerDurationCurveSimple } from './workout/power/meanMaxPowerCurve'
import { getWorkoutFromSegments } from './workout/metrics/getWorkoutsFromSegments'
import { getSegmentsFromArray } from './workout/metrics/getSegmentsFromArray'
import * as ts from './workout/metrics/stress-intensity/trainingStressAndIntensityFactor'
export { getWorkoutStats } from './workout/metrics/workoutStatistics'
export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/clt'
export { getTrainingStressBalance } from './workouts/volume/tsb'

export const getMeanMaxPowerCurve = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  return getPowerDurationCurveSimple(mmp.timePoints, mmp.timeLength, mmp.powerCurvePoints)
}

export const getTrainingStress = (ftp: number, intervals:[[number,number,number]]): number => {
  const segments = getWorkoutFromSegments(intervals).segments
  return ts.getTrainingStress(100, getSegmentsFromArray(segments))
}




