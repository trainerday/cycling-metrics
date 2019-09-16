import { zipWith } from 'lodash'
import { WorkoutMetrics } from '../../models/workoutMetrics'
import { MetricsPoint } from '../../models/metricsPoint'
import { getPowerArray } from './workoutMetricsHelper'

export const convertStravaToCyclingMetrics = (secondsArr: number[], powerArr?: number[], hrArray?: number[]) => {
  // prevent interpolating results array with undefined values

  if (!hrArray) {
    hrArray = []
  }

  if (!powerArr) {
    powerArr = []
  }

  if (secondsArr === null || secondsArr.length === 0) {
    throw Error('seconds array must be longer than 0')
  }

  if (powerArr.length > 0 && secondsArr.length !== powerArr.length) {
    throw Error('if power array is present it must be the same length as seconds array')
  }

  if (hrArray.length > 0 && secondsArr.length !== hrArray.length) {
    //        console.log(hrArray.length,secondsArr.length)
    throw Error('if hr array is present it must be the same length as seconds array')
  }

  return zipWith<number, number, number, MetricsPoint>(secondsArr, powerArr, hrArray, (s, p, h) => ({
    time: s,
    power: p,
    heartRate: h,
  }))
}

export const convertStravaToWorkoutMetrics = (secondsArr: number[], powerArr?: any[], hrArray?: number[]): number[] => {
  const wm =  new WorkoutMetrics(convertStravaToCyclingMetrics(secondsArr, powerArr, hrArray))
  return getPowerArray(wm.cycleMetrics)
}
