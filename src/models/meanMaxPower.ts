import { PowerCurvePoint } from './powerCurvePoint'
import { getPowerCurve, getTimePoints } from '../workout/power/meanMaxPowerCurve'

export class MeanMaxPower {
  public powerCurvePoints: PowerCurvePoint[]
  public timePoints: number[]
  public timeLength: number

  public constructor(powerValues: number[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label
    this.timeLength = powerValues.length
    this.timePoints = getTimePoints(this.timeLength, timePoints)
    this.powerCurvePoints = getPowerCurve(powerValues, labelValue, this.timePoints)
  }
}
