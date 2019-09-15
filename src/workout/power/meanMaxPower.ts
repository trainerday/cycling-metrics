import _ from 'lodash'
import { PowerCurvePoint } from '../../models/powerCurvePoint'
import { generateLogScale } from '../../common/generateLogScale'
import { movingAverage } from  '../../common/movingAverage'

const getMaxPowerForInterval = (powerValues: number[], intervalLength: number): number => {
  const averages = movingAverage(powerValues, intervalLength)
  return <number>_.max(averages)
}

const getPowerCurve = (powerValues: (number)[], label: string, timePoints: number[]) => {
  let prevValue = getMaxPowerForInterval(powerValues, 1)
  let prevTime: number = _.first(timePoints!)!
  const result = new Array<PowerCurvePoint>()
  timePoints.forEach(time => {
    const powerValue = getMaxPowerForInterval(powerValues, time)
    if (prevValue !== powerValue) {
      result.push(new PowerCurvePoint(prevTime, prevValue, label))
    }
    prevValue = powerValue
    prevTime = time
  })
  result.push(new PowerCurvePoint(prevTime, prevValue, label))
  return result
}

export class MeanMaxPower {
  public curvePoints: PowerCurvePoint[]
  public timePoints: number[]
  public timeLength: number

  constructor(powerValues: number[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label
    this.timeLength = powerValues.length
    this.timePoints =
      timePoints !== undefined ? _.filter(timePoints, t => t <= this.timeLength) : this.getDefaultTimePoints(this.timeLength)
    this.curvePoints = getPowerCurve(powerValues, labelValue, this.timePoints)
  }

  private getDefaultTimePoints(timeLength: number) {
    const logScale = 1.5
    const fixedPoints = _.range(1, Math.min(20, timeLength + 1))
    const logPoints = generateLogScale(logScale, this.timeLength)
    return _.uniq([...fixedPoints, ...logPoints]).sort((n1:number, n2:number) => n1 - n2)
  }

  public get(time: number) {
     const max = this.timeLength
     if (time > max || time < 0) {
       return undefined
     }
     const tail = _.dropWhile(this.curvePoints, x => x.time < time)
     if (tail.length > 0) {
       return _.first(tail)
     }
     return _.last(this.curvePoints)
   }
 
  public get Curve(): number[] {
     return this.timePoints.map(x => this.get(x)!.power!)
   }
 
  public get TimePoints(): number[] {
     return this.timePoints
   }

  public get CurvePoints() : PowerCurvePoint[]  {
     return this.curvePoints
  }
}
