import _ from 'lodash'
import { PowerCurvePoint } from '../../models/powerCurvePoint'
import { MeanMaxPower } from './meanMaxPower'

export function mergeAll(curves: MeanMaxPower[], label?: string): MeanMaxPower {
  return curves.reduce((x1, x2) => merge(x1, x2, label, label))
}

export function merge(curve1: MeanMaxPower, curve2: MeanMaxPower, label1?: string, label2?: string): MeanMaxPower {
  const curve1Iter = curve1.curve.values()
  const curve2Iter = curve2.curve.values()
  let value1 = curve1Iter.next()
  let value2 = curve2Iter.next()

  const result = new Array<PowerCurvePoint>()
  do {
    if (value1.value.time === value2.value.time) {

      const temp = (value1.value.power! > value2.value.power! ? new PowerCurvePoint(value1.value.power!,undefined, label1) : new PowerCurvePoint(value2.value.power!,undefined, label2))
      result.push(temp)
      value1 = curve1Iter.next()
      value2 = curve2Iter.next()
    } else if (value1.value.time! < value2.value.time!) {
      if (value1.value.power! > value2.value.power!) {
        result.push(new PowerCurvePoint(value1.value.power!, undefined, label1))
      }
      value1 = curve1Iter.next()
    } else if (value1.value.time! > value2.value.time!) {
      if (value1.value.power! < value2.value.power!) {
        result.push(new PowerCurvePoint(value2.value.power!, undefined, label1))
      }
      value2 = curve2Iter.next()
    }
  } while (!value1.done && !value2.done)
  while (!value1.done) {
    result.push(new PowerCurvePoint(value1.value.power!, undefined, label1))
    value1 = curve1Iter.next()
  }
  while (!value2.done) {
    result.push(new PowerCurvePoint(value2.value.power!, undefined, label1))
    value2 = curve2Iter.next()
  }

  const timePoints = _.uniq([...curve1.timePoints, ...curve2.timePoints]).sort((n1, n2) => n1 - n2)
  const curve = new MeanMaxPower([0])
  curve.curve = result
  curve.timePoints = timePoints
  // @ts-ignore
  curve.timeLength = _.maxBy(result, x => x.time).time
  return curve
}

