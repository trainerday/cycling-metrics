import _ from 'lodash'
import { PowerCurvePoint } from '../../models/powerCurvePoint'
import { movingAverage } from '../../common/movingAverage'

export const getPowerCurve = (powerValues: (number | undefined)[], label: string, timePoints: number[]) => {
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

function getMaxPowerForInterval(powerValues: (number | undefined)[], intervalLength: number): number | undefined {
  const averages = movingAverage(powerValues, intervalLength)
  return _.max(averages)
}


export const getMeanMaxPowerLast = (time?: number, curve?: PowerCurvePoint[],timeLength?: number): (PowerCurvePoint | undefined) => {

  if (!time || time > timeLength! || time < 0) {
    return undefined
  }
  const tail = _.dropWhile(curve, x => x.time! < time)
  if (tail.length > 0) {
    return _.first(tail)
  }
  return _.last(curve)
}

export const getCurve = (timePoints: (number | undefined)[], curve: PowerCurvePoint[]): number[] => {
  return timePoints.map(x => getMeanMaxPowerLast(x, curve, timePoints.length)!.power!)
}
