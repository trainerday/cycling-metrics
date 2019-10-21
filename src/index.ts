import { MeanMaxPower } from './models/meanMaxPower'
import { getPowerDurationCurveSimple } from './workout/power/meanMaxPowerCurve'
import { getWorkoutIntervalsFromSegments } from './workout/metrics/getWorkoutsFromSegments'
import { getSegmentsFromArray } from './workout/metrics/getSegmentsFromArray'
import * as ts from './workout/metrics/stress-intensity/trainingStressAndIntensityFactor'
import { ZoneTypes } from "./workout/metrics/zones/types";
import * as z from './workout/metrics/zones/zones'
export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/clt'
export { getTrainingStressBalance } from './workouts/volume/tsb'

export const getMeanMaxPowerCurve = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  return getPowerDurationCurveSimple(mmp.timePoints, mmp.timeLength, mmp.powerCurvePoints)
}

export const getTrainingStress = (ftp: number, intervals:[number, number, number][]): number => {
  const ftpValue = ftp ? ftp : 100
  const segments = getWorkoutIntervalsFromSegments(intervals)
  return ts.getTrainingStress(ftpValue, getSegmentsFromArray(segments))
}

export const getIntensityFactor = (ftp: number, intervals:[number, number, number][]): number | null=> {
  const ftpValue = ftp ? ftp : 100
  const segments = getWorkoutIntervalsFromSegments(intervals)
  const { if: intensityFactor = null } = ts.getIntensityFactor(ftpValue, getSegmentsFromArray(segments))
  return intensityFactor
}

export const getDominantZone = (ftp: number, intervals:[number, number, number][]): ZoneTypes | null => {
  const ftpValue = ftp ? ftp : 100
  const segments = getWorkoutIntervalsFromSegments(intervals)
  const dominantZone = z.getDominantZone(ftpValue, getSegmentsFromArray(segments))
  return z.zones[dominantZone]
}

import { getTimeInZone } from "./workout/metrics/zones/zones"
import { getWorkoutClassificationGroup } from "./workout/metrics/getWorkoutClassificationGroup"
import { getTimeType } from "./workout/metrics/getTimeType"

export {
  getTimeInZone,
  getWorkoutClassificationGroup,
  getTimeType,
}




