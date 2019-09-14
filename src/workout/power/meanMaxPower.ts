import _ from 'lodash'
import { PowerCurvePoint } from '../../models/powerCurvePoint'
import { generateLogScale } from '../../common/generateLogScale'
import { getPowerCurve } from './meanMaxPowerGetCurve'


export class MeanMaxPower {
  public curve: PowerCurvePoint[]
  public timePoints: number[]
  public timeLength: number


  constructor(powerValues: (number | undefined)[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label
    this.timeLength = powerValues.length
    this.timePoints =
      timePoints !== undefined ? _.filter(timePoints, t => t <= this.timeLength) : this.getDefaultTimePoints(this.timeLength)
    this.curve = getPowerCurve(powerValues, labelValue, this.timePoints)
  }


  private getDefaultTimePoints(timeLength: number) {
    const logScale = 1.5
    const fixedPoints = _.range(1, Math.min(20, timeLength + 1))
    const logPoints = generateLogScale(logScale, this.timeLength)
    return _.uniq([...fixedPoints, ...logPoints]).sort((n1, n2) => n1 - n2)
  }
}
