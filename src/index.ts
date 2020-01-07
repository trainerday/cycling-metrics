import { MeanMaxPower } from './models/meanMaxPower'
import { getPowerDurationCurveSimple } from './workout/power/meanMaxPowerCurve'
import { getWorkoutIntervalsFromSegments } from './workout/metrics/getWorkoutsFromSegments'
import { getSegmentsFromArray } from './workout/metrics/getSegmentsFromArray'
import * as ts from './workout/metrics/stress-intensity/trainingStressAndIntensityFactor'
import { ZoneTypes } from "./workout/metrics/zones/types";
import * as z from './workout/metrics/zones/zones'
export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/ctl'
export { getTrainingStressBalance } from './workouts/volume/tsb'

export const getMeanMaxPowerCurve = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  return getPowerDurationCurveSimple(mmp.timePoints, mmp.timeLength, mmp.powerCurvePoints)
}

export const getTrainingStress = (segments: [number, number, number][], ftp: number = 100): number => {
  const intervals = getWorkoutIntervalsFromSegments(segments)
  return ts.getTrainingStress(ftp, getSegmentsFromArray(intervals))
}

export const getIntensityFactor = (segments: [number, number, number][], ftp: number = 100): number | null=> {
  const intervals = getWorkoutIntervalsFromSegments(segments)
  const { if: intensityFactor = null } = ts.getIntensityFactor(ftp, getSegmentsFromArray(intervals))
  return intensityFactor
}

export const getDominantZone = (segments: [number, number, number][], ftp: number = 100): ZoneTypes | null => {
  const intervals = getWorkoutIntervalsFromSegments(segments)
  const dominantZone = z.getDominantZone(ftp, getSegmentsFromArray(intervals))
  return z.zones[dominantZone]
}

export const getTimeInZone = (segments: [number, number, number][], ftp: number = 100): Object => {
  const intervals = getWorkoutIntervalsFromSegments(segments)
  return z.getTimeInZone(ftp, getSegmentsFromArray(intervals))
}

import { getWorkoutClassificationGroup } from "./workout/metrics/getWorkoutClassificationGroup"
import { getTimeType } from "./workout/metrics/getTimeType"

export {
  getWorkoutClassificationGroup,
  getTimeType,
}




