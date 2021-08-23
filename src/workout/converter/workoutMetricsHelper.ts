import _ from 'lodash'
import { MetricsPoint } from '../../models/metricsPoint'

export const getPowerArray = (cycleMetrics: MetricsPoint[]): number[] => {
  return _.map(cycleMetrics, (x: MetricsPoint): number => {
    if (x.power) {
      return x.power
    }
    throw Error('Power value should be defined at this point')
  })
}

export const interpolateMissingPowerValues = (cycleMetrics: MetricsPoint[]): void => {
  const headValueObj = _.find(cycleMetrics, (point: MetricsPoint) => point.power !== undefined)
  const tailValueObj = _.findLast(cycleMetrics, (point: MetricsPoint) => point.power !== undefined)
  let headValue = 0
  let tailValue = 0
  if (headValueObj && headValueObj.power) headValue = headValueObj.power
  if (tailValueObj && tailValueObj.power) tailValue = tailValueObj.power

  // extrapolate on the edges to a const
  for (let i = 0; !cycleMetrics[i].power; i++) {
    cycleMetrics[i].power = headValue
  }
  for (let i = cycleMetrics.length - 1; !cycleMetrics[i].power; i--) {
    cycleMetrics[i].power = tailValue
  }
  // interpolate holes linearly
  for (let i = 1; i < cycleMetrics.length - 1; i++) {
    if (!cycleMetrics[i].power) {
      const lidX = i - 1
      let ridX = i + 1
      while (!cycleMetrics[ridX].power) {
        ridX++
      }
      const lvalue = cycleMetrics[lidX].power
      const rvalue = cycleMetrics[ridX].power
      // @ts-ignore
      cycleMetrics[i].power = lvalue + (rvalue - lvalue) / (ridX - lidX)
    }
  }
}

export const interpolateMissingTimePoints = (cycleMetrics: MetricsPoint[]): MetricsPoint[] => {
  const maxTime = _.maxBy(cycleMetrics, (m: MetricsPoint) => m.time)
  const metricsLookup = _.keyBy(cycleMetrics, (m: MetricsPoint) => m.time)

  if (!maxTime) return []
  const result = new Array<MetricsPoint>()
  for (let i = 0; i <= maxTime.time; i++) {
    if (metricsLookup[i] !== undefined) {
      result.push(metricsLookup[i])
    } else {
      result.push(new MetricsPoint(i, undefined, undefined))
    }
  }
  return result
}
