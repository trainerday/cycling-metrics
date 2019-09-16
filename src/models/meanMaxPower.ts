import _ from 'lodash'
import { PowerCurvePoint } from './powerCurvePoint'
import { getPowerCurve, getDefaultTimePoints } from '../workout/power/meanMaxHelper'

export class MeanMaxPower {
  public curvePoints: PowerCurvePoint[]
  public timePoints: number[]
  public timeLength: number

  public constructor(powerValues: number[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label
    this.timeLength = powerValues.length
    this.timePoints = this.getTimePoints(this.timeLength, timePoints)
    this.curvePoints = getPowerCurve(powerValues, labelValue, this.timePoints)
  }
  private getTimePoints(timeLength: number, timePoints?: number[]): number[] {
    return timePoints !== undefined
      ? (_.filter(timePoints, (t: number) => t <= timeLength) as number[])
      : getDefaultTimePoints(this.timeLength)
  }
}
