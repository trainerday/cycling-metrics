import _ from 'lodash'
import { PowerCurvePoint } from '../../models/powerCurvePoint'
import { MeanMaxPower } from '../../models/meanMaxPower'

export function getMeanMaxPowerFromCurves(curves: MeanMaxPower[], label?: string): MeanMaxPower {
  return curves.reduce((x1, x2) => getMergedCurveFromTwoCurves(x1, x2, label, label))
}

export function getMergedCurveFromTwoCurves(
  curve1: MeanMaxPower,
  curve2: MeanMaxPower,
  label1?: string,
  label2?: string,
): MeanMaxPower {
  const curve1Iter = curve1.powerCurvePoints.values()
  const curve2Iter = curve2.powerCurvePoints.values()
  let value1 = curve1Iter.next()
  let value2 = curve2Iter.next()

  const clonePoint = (point: PowerCurvePoint, label?: string) =>
    label ? new PowerCurvePoint(point.time, point.power, label) : point

  const result = new Array<PowerCurvePoint>()
  do {
    if (value1.value.time === value2.value.time) {
      const temp =
        value1.value.power > value2.value.power ? clonePoint(value1.value, label1) : clonePoint(value2.value, label2)
      result.push(temp)
      value1 = curve1Iter.next()
      value2 = curve2Iter.next()
    } else if (value1.value.time < value2.value.time) {
      if (value1.value.power > value2.value.power) {
        result.push(clonePoint(value1.value, label1))
      }
      value1 = curve1Iter.next()
    } else if (value1.value.time > value2.value.time) {
      if (value1.value.power < value2.value.power) {
        result.push(clonePoint(value2.value, label2))
      }
      value2 = curve2Iter.next()
    }
  } while (!value1.done && !value2.done)
  while (!value1.done) {
    result.push(clonePoint(value1.value, label1))
    value1 = curve1Iter.next()
  }
  while (!value2.done) {
    result.push(clonePoint(value2.value, label2))
    value2 = curve2Iter.next()
  }

  const timePoints = _.uniq([...curve1.timePoints, ...curve2.timePoints]).sort((n1, n2) => n1 - n2)
  const curve = new MeanMaxPower([0])
  curve.powerCurvePoints = result
  curve.timePoints = timePoints
  // @ts-ignore
  curve.timeLength = _.maxBy(result, x => x.time).time
  return curve
}
