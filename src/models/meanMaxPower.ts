import _ from 'lodash'
import { PowerCurvePoint } from './powerCurvePoint'
import { getPowerCurve,getDefaultTimePoints } from '../workout/power/meanMaxHelper'

export class MeanMaxPower {
  public curvePoints: PowerCurvePoint[]
  public timePoints: number[]
  public timeLength: number

  constructor(powerValues: number[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label
    this.timeLength = powerValues.length
    this.timePoints =
      timePoints !== undefined
        ? _.filter(timePoints, t => t <= this.timeLength)
        : getDefaultTimePoints(this.timeLength)
    this.curvePoints = getPowerCurve(powerValues, labelValue, this.timePoints)
  }

}
