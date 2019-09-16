import { MeanMaxPower } from './models/meanMaxPower'
import { getPowerDurationCurveSimple } from './workout/power/meanMaxPowerCurve'
import { getWorkoutIntervalsFromSegments } from './workout/metrics/getWorkoutsFromSegments'
import { getSegmentsFromArray } from './workout/metrics/getSegmentsFromArray'
import * as ts from './workout/metrics/stress-intensity/trainingStressAndIntensityFactor'
export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/clt'
export { getTrainingStressBalance } from './workouts/volume/tsb'

export const getMeanMaxPowerCurve = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  return getPowerDurationCurveSimple(mmp.timePoints, mmp.timeLength, mmp.powerCurvePoints)
}

export const getTrainingStress = (ftp: number, intervals:[number, number, number][]): number => {
  const segments = getWorkoutIntervalsFromSegments(intervals)
  return ts.getTrainingStress(ftp, getSegmentsFromArray(segments))
}




