import { MeanMaxPower } from './models/meanMaxPower'
import { getPowerDurationCurveSimple, getPowerDurationCurveSimpleMMP } from './workout/power/meanMaxPowerCurve'
import { getWorkoutIntervalsFromSegments } from './workout/metrics/getWorkoutsFromSegments'
import { getSegmentsFromArray } from './workout/metrics/getSegmentsFromArray'
import * as ts from './workout/metrics/stress-intensity/trainingStressAndIntensityFactor'
import { ZoneTypes } from './workout/metrics/zones/types'
import * as z from './workout/metrics/zones/zones'
export * from './workouts/power/mergeCurve'
export { insertMissingElementsInSequence } from './common/insertMissingElements'

export { convertStravaToCyclingMetrics } from './workout/converter/convertStravaToCyclingMetrics'
export { getCtl } from './workouts/volume/ctl'
export { getTrainingStressBalance } from './workouts/volume/tsb'
import { TimeTypes } from './workout/metrics/types'

export const getMeanMaxPowerCurve = (powerPerSecond: number[]): number[] => {
  const mmp = new MeanMaxPower(powerPerSecond)
  return getPowerDurationCurveSimple(mmp.timePoints, mmp.timeLength, mmp.powerCurvePoints)
}

export const getTrainingStress = (
  segments: [number, number, number][],
  ftp: number = 100,
  segmentsTimeType: TimeTypes = TimeTypes.MINUTES,
): number => {
  const intervals = getWorkoutIntervalsFromSegments(segments, segmentsTimeType)
  return ts.getTrainingStress(ftp, getSegmentsFromArray(intervals))
}

export const getIntensityFactor = (
  segments: [number, number, number][],
  ftp: number = 100,
  segmentsTimeType: TimeTypes = TimeTypes.MINUTES,
): number | null => {
  const intervals = getWorkoutIntervalsFromSegments(segments, segmentsTimeType)
  const { if: intensityFactor = null } = ts.getIntensityFactor(ftp, getSegmentsFromArray(intervals))
  return intensityFactor
}

export const getDominantZone = (
  segments: [number, number, number][],
  ftp: number = 100,
  segmentsTimeType: TimeTypes = TimeTypes.MINUTES,
): ZoneTypes | null => {
  const intervals = getWorkoutIntervalsFromSegments(segments, segmentsTimeType)
  const dominantZone = z.getDominantZone(ftp, getSegmentsFromArray(intervals))
  return z.zones[dominantZone]
}

export const getTimeInZone = (
  segments: [number, number, number][],
  ftp: number = 100,
  segmentsTimeType: TimeTypes = TimeTypes.MINUTES,
): Record<string, any> => {
  const intervals = getWorkoutIntervalsFromSegments(segments, segmentsTimeType)
  return z.getTimeInZone(ftp, getSegmentsFromArray(intervals))
}

export const getSegmentsPower = (segments: [number, number, number][]) => {
  const intervals = getWorkoutIntervalsFromSegments(segments, TimeTypes.MINUTES)
  return getSegmentsFromArray(intervals)
}

import { getWorkoutClassificationGroup } from './workout/metrics/getWorkoutClassificationGroup'
import { getTimeType } from './workout/metrics/getTimeType'
export { getWorkoutClassificationGroup, getTimeType, TimeTypes }
export { primeBalance } from './workout/wbal'

import wPrimeBalanceFroncioniSkibaClarke from './workout/wbal/w_prime_balance_froncioni_skiba_clarke'
export { wPrimeBalanceFroncioniSkibaClarke }
