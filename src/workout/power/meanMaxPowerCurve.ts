import _ from 'lodash'
import { PowerCurvePoint } from '../../models/powerCurvePoint'
import { movingAverage } from '../../common/movingAverage'
import { generateLogScale } from '../../common/generateLogScale'

export const getPowerDurationCurveSimple = (timePoints: number[], timeLength: number, curvePoints: PowerCurvePoint[]): number[] =>{
  return timePoints.map(x => getLastPowerCurvePoint(x, timeLength, curvePoints)!.power!)
}

export const getDefaultTimePoints = (timeLength: number):number[] => {
  const logScale = 1.5
  const fixedPoints = _.range(1, Math.min(20, timeLength + 1))
  const logPoints = generateLogScale(logScale, timeLength)
  return _.uniq([...fixedPoints, ...logPoints]).sort((n1: number, n2: number) => n1 - n2)
}

export const getLastPowerCurvePoint = (time: number, max: number, curvePoints: PowerCurvePoint[]): (PowerCurvePoint | undefined) => {
  if (time > max || time < 0) {
    return undefined
  }
  const tail = _.dropWhile(curvePoints, x => x.time < time)
  if (tail.length > 0) {
    return _.first(tail) as PowerCurvePoint
  }
  return _.last(curvePoints)
}

export const getMaxPowerForInterval = (powerValues: number[], intervalLength: number): number => {
  const averages = movingAverage(powerValues, intervalLength)
  return <number>_.max(averages)
}

export const getTimePoints = (timeLength: number, timePoints?: number[]): number[] => {
  return timePoints !== undefined
    ? (_.filter(timePoints, (t: number) => t <= timeLength) as number[])
    : getDefaultTimePoints(timeLength)
}

export const getPowerCurve = (powerValues: (number)[], label: string, timePoints: number[]) => {
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
