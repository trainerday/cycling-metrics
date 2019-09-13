import _ from 'lodash'
import * as utils from '../../common/utils'
import { PowerCurvePoint2 } from '../../models/powerCurvePoint2'



export function generateLogScale(logScale: number, timeLength: number) {
  const points = new Array<number>()
  let current = 1
  while (current < timeLength) {
    points.push(current)
    current = Math.ceil(current * logScale)
  }
  return points
}

export class MeanMaxPower {
  public curve: PowerCurvePoint2[]
  public timePoints: number[]
  public timeLength: number


  constructor(powerValues: number[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label
    this.timeLength = powerValues.length
    this.timePoints =
      timePoints !== undefined ? _.filter(timePoints, t => t <= this.timeLength) : this.getDefaultTimePoints()
    this.curve = this.buildCurve(powerValues, labelValue)
  }

  public static MergeAll(curves: MeanMaxPower[], label?: string): MeanMaxPower {
    return curves.reduce((x1, x2) => MeanMaxPower.Merge(x1, x2, label, label))
  }

  public static Merge(curve1: MeanMaxPower, curve2: MeanMaxPower, label1?: string, label2?: string): MeanMaxPower {
    const curve1Iter = curve1.curve.values()
    const curve2Iter = curve2.curve.values()
    let value1 = curve1Iter.next()
    let value2 = curve2Iter.next()

    const result = new Array<PowerCurvePoint2>()
    do {
      if (value1.value.time === value2.value.time) {

        const temp = (value1.value.power! > value2.value.power! ? new PowerCurvePoint2(value1.value.power!,undefined, label1) : new PowerCurvePoint2(value2.value.power!,undefined, label2))
        result.push(temp)
        value1 = curve1Iter.next()
        value2 = curve2Iter.next()
      } else if (value1.value.time! < value2.value.time!) {
        if (value1.value.power! > value2.value.power!) {
          result.push(new PowerCurvePoint2(value1.value.power!, undefined, label1))
        }
        value1 = curve1Iter.next()
      } else if (value1.value.time! > value2.value.time!) {
        if (value1.value.power! < value2.value.power!) {
          result.push(new PowerCurvePoint2(value2.value.power!, undefined, label1))
        }
        value2 = curve2Iter.next()
      }
    } while (!value1.done && !value2.done)
    while (!value1.done) {
      result.push(new PowerCurvePoint2(value1.value.power!, undefined, label1))
      value1 = curve1Iter.next()
    }
    while (!value2.done) {
      result.push(new PowerCurvePoint2(value2.value.power!, undefined, label1))
      value2 = curve2Iter.next()
    }

    const timePoints = _.uniq([...curve1.TimePoints, ...curve2.TimePoints]).sort((n1, n2) => n1 - n2)
    const curve = new MeanMaxPower([0])
    curve.curve = result
    curve.timePoints = timePoints
    // @ts-ignore
    curve.timeLength = _.maxBy(result, x => x.time).time
    return curve
  }



  public get(time: number) {
    const max = this.timeLength
    if (time > max || time < 0) {
      return undefined
    }
    const tail = _.dropWhile(this.curve, x => x.time! < time)
    if (tail.length > 0) {
      return _.first(tail)
    }
    return _.last(this.curve)
  }

  public get Curve(): number[] {
    return this.timePoints.map(x => this.get(x)!.power!)
  }

  public get TimePoints(): number[] {
    return this.timePoints
  }

  private buildCurve(powerValues: number[], label: string) {
    let prevValue = MeanMaxPower.getMaxPowerForInterval(powerValues, 1)
    let prevTime: number = _.first(this.timePoints!)!
    const result = new Array<PowerCurvePoint2>()
    this.timePoints.forEach(time => {
      const powerValue = MeanMaxPower.getMaxPowerForInterval(powerValues, time)
      if (prevValue !== powerValue) {
        result.push(new PowerCurvePoint2(prevTime, prevValue, label))
      }
      prevValue = powerValue
      prevTime = time
    })
    result.push(new PowerCurvePoint2(prevTime, prevValue, label))
    return result
  }

  private static getMaxPowerForInterval(powerValues: number[], intervalLength: number): number | undefined {
    const averages = utils.movingAverage(powerValues, intervalLength)
    return _.max(averages)
  }

  private getDefaultTimePoints() {
    const logScale = 1.5
    const fixedPoints = _.range(1, Math.min(20, this.timeLength + 1))
    const logPoints = generateLogScale(logScale, this.timeLength)
    return _.uniq([...fixedPoints, ...logPoints]).sort((n1, n2) => n1 - n2)
  }
}
