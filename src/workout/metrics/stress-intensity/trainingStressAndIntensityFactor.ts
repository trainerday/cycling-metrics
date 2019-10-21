import _ from 'lodash'
import { movingAverage } from '../../../common/movingAverage'

export function getTrainingStress(ftp: number, powerValues: number[]) {
  // this is essentially the same algorithm used by TrainingPeaks, they call it TSS
  // TP claims to have their own secret error correction which we don't have
  // but I should note it's not needed for structured/planned workouts only for actual activities
  const { if: IF, seconds: t, np: NP } = getIntensityFactor(ftp, powerValues)
  return _.round(((t * NP * IF) / (ftp * 3600)) * 100)
}

export function getIntensityFactor(ftp: number, powerValues: number[]) {
  const { np: NP, seconds: seconds } = getNormalizedPower(powerValues)
  const IF = Math.round(NP / ftp * 100) / 100
  return { if: IF, seconds, np: NP }
}

function getNormalizedPower(powerValues: number[]) {
  if (powerValues.length < 120) {
    return { np: 0, seconds: 0 }
  }
  const mvAvg = movingAverage(powerValues, 30)
  const avgPow4 = _.sumBy(mvAvg, x => _.round(Math.pow(x, 4), 2)) / mvAvg.length
  const avg = _.round(Math.pow(avgPow4, 0.25), 2)
  return { np: avg, seconds: powerValues.length }
}
