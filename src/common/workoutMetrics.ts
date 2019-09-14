import _ from 'lodash'
import { MetricsPoint } from '../models/metricsPoint'

export class WorkoutMetrics {
  private readonly cycleMetrics: MetricsPoint[]

  public constructor(cycleMetrics: MetricsPoint[]) {
    const continuousTime = WorkoutMetrics.interpolateMissingTimePoints(cycleMetrics)
    this.interpolateMissingPowerValues(continuousTime)
    this.cycleMetrics = continuousTime
  }

  public getPowerArray(): number[] {
    const out = _.map(this.cycleMetrics, (x: MetricsPoint): number => {
      return x.power
    })
    if (out) return out as number[]
    return []
  }

  private interpolateMissingPowerValues(cycleMetrics: MetricsPoint[]): void {
    /*eslint-disable */
    const headValueObj = _.find(cycleMetrics, point => point.power !== undefined)
    const tailValueObj = _.findLast(cycleMetrics, point => point.power !== undefined)
    /*eslint-enable */
    let headValue = 0
    let tailValue = 0
    if (headValueObj && headValueObj.power) headValue = headValueObj.power
    if (tailValueObj && tailValueObj.power) tailValue = tailValueObj.power

    // extrapolate on the edges to a const
    for (let i = 0; cycleMetrics[i].power === undefined; i++) {
      cycleMetrics[i].power = headValue
    }
    for (let i = cycleMetrics.length - 1; cycleMetrics[i].power === undefined; i--) {
      cycleMetrics[i].power = tailValue
    }
    // interpolate holes linearly
    for (let i = 1; i < cycleMetrics.length - 1; i++) {
      if (cycleMetrics[i].power === undefined) {
        const lidX = i - 1
        let ridX = i + 1
        while (cycleMetrics[ridX].power === undefined) {
          ridX++
        }
        const lvalue = cycleMetrics[lidX].power
        const rvalue = cycleMetrics[ridX].power
        // @ts-ignore
        cycleMetrics[i].power = lvalue + (rvalue - lvalue) / (ridX - lidX)
      }
    }
  }

  private static interpolateMissingTimePoints(cycleMetrics: MetricsPoint[]): MetricsPoint[] {
    /*eslint-disable */
    const maxTime = _.maxBy(cycleMetrics, (m: MetricsPoint) => m.time)
    const metricsLookup = _.keyBy(cycleMetrics, (m: MetricsPoint) => m.time)
    /*eslint-enable */

    if (!maxTime) return []
    const result = new Array<MetricsPoint>()
    for (let i = 0; i <= maxTime.time; i++) {
      if (metricsLookup[i] !== undefined) {
        result.push(metricsLookup[i])
      } else {
        // TODO ALEX not pushing undefined
        //result.push(new MetricsPoint(i, undefined, undefined))
      }
    }
    return result
  }
}
