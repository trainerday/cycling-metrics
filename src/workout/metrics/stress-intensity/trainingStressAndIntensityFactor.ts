import _ from 'lodash'
import { movingAverage } from '../../../common/movingAverage'

export function getTss(ftp: number, powerValues: number[]) {
  const { if: IF, seconds: t, np: NP } = getIntensityFactor(ftp, powerValues)
  return _.round(((t * NP * IF) / (ftp * 3600)) * 100)
}

export function getIntensityFactor(ftp: number, powerValues: number[]) {
  const { np: NP, seconds: seconds } = getNormalizedPower(powerValues)
  const IF = NP / ftp
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
