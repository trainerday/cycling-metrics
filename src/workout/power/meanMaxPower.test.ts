import { drop, range } from 'lodash'
import { convertStravaToWorkoutMetrics } from '../converter/convertStravaToCyclingMetrics'
import { MeanMaxPower } from './meanMaxPower'
import { generateLogScale } from '../../common/generateLogScale'
import { merge, mergeAll } from './meanMaxPowerMerge'
import { data } from './meanMaxPowerTestData'

describe('Power duration curve', () => {
  test('should decrease linearly for linear power2', () => {
    const power = [120, 140, 160]
    const mmp = new MeanMaxPower(power)
    expect(mmp.Curve).toEqual([160, 150, 140])
  })

  test('should decrease linearly for linear power', () => {
    const power = [120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100]
    const mmp = new MeanMaxPower(power)
    expect(mmp.Curve).toEqual([120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110])
  })

  test('should be const for const power', () => {
    const power = [110, 110, 110, 110, 110, 110, 110, 110, 110, 110, 110]
    const mmp = new MeanMaxPower(power)
    expect(mmp.Curve).toEqual([110, 110, 110, 110, 110, 110, 110, 110, 110, 110, 110])
  })

  test('should decrease gradually for bell-like power spike', () => {
    const power = [102, 106, 110, 114, 118, 120, 116, 112, 108, 104, 100]
    const mmp = new MeanMaxPower(power)
    expect(mmp.Curve).toEqual([120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110])
  })

  test('should interpolate undefined power value linearly', () => {
    const time = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const powerReading = [120, 118, 116, undefined, 112, undefined, undefined, 106, 104, undefined, 100]
    const metrics = convertStravaToWorkoutMetrics(time, powerReading)
    const mmp = new MeanMaxPower(metrics)
    expect(mmp.Curve).toEqual([120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110])
  })

  test('should extrapolate boundary to const', () => {
    const time = [0, 1, 2]
    const power = [undefined, 120, undefined]
    const metrics = convertStravaToWorkoutMetrics(time, power)
    const mm = new MeanMaxPower([...metrics])
    expect(mm.Curve).toEqual([120, 120, 120])
  })

  test('should interpolate missing Metrics points linearly', () => {
    const time = [0, 10]
    const power = [120, 100]
    const metrics = convertStravaToWorkoutMetrics(time, power)
    const mmp = new MeanMaxPower([...metrics])
    expect(mmp.Curve).toEqual([120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110])
  })

  test('sample response stream', () => {
    const time = data.filter(x => x.type === 'time')[0].data as number[]
    const hr = data.filter(x => x.type === 'heartrate')[0].data as number[]
    const power = data.filter(x => x.type === 'watts')[0].data as number[]
    const metrics = convertStravaToWorkoutMetrics(time, power, hr)

    debugger
    const curve = new MeanMaxPower([...metrics])
    const powerCurve = drop(curve.Curve, 1)
    //const points = drop(curve.TimePoints, 1)

    const min = Math.min.apply(null, power)
    const max = Math.max.apply(null, power)

    // console.log(powerCurve.length);
    // writeFile("logCurve.json", JSON.stringify(powerCurve), x => {} );
    // writeFile("logCurveTime.json", JSON.stringify(points), x => {} );
    powerCurve.forEach(pwr => {
      expect(pwr).toBeLessThanOrEqual(max)
      expect(pwr).toBeGreaterThanOrEqual(min)
    })
  })
})

describe('Power curve intervals', () => {
  test('should return values between interval', () => {
    const power = [120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100]
    expect(new MeanMaxPower(power, range(1, power.length, 4)).Curve).toEqual([120, 116, 112])
  })

  test('should return values in log scale', () => {
    const power = [120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100]
    expect(new MeanMaxPower(power, generateLogScale(2, power.length)).Curve).toEqual([120, 119, 117, 113])
  })
  test('should return values for last segment', () => {
    const power = [120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100]
    const meanMaxCurve = new MeanMaxPower(power, generateLogScale(2, power.length))
    const value = meanMaxCurve.get(11)
    expect(value).not.toBeUndefined()
  })
})

describe('Power Average', () => {
  test('should be average power', () => {
    const power = [110, 110, 110, 110, 110, 120, 120, 120, 120, 120]
    const pdCurve = new MeanMaxPower(power).Curve
    expect(pdCurve[0]).toEqual(120)
    expect(pdCurve[1]).toEqual(120)
    expect(pdCurve[3]).toEqual(120)
    expect(pdCurve[9]).toEqual(115)
  })
})

describe('Power curve merge', () => {
  const power1 = [130, 130, 130, 130, 130, 120, 120, 120, 120, 120]
  const power2 = [160, 150, 140, 130, 120, 110, 100, 100, 100, 100]
  const power3 = [125.1, 125.1, 125.1, 125.1, 125.1, 125.1, 125.1, 125.1, 125.1, 125.1]
  const curve1 = new MeanMaxPower(power1, undefined, 'training1')
  const curve2 = new MeanMaxPower(power2, undefined, 'training2')
  const curve3 = new MeanMaxPower(power3, undefined, 'training3')

  test('gets max for each time point', () => {
    const mergeCurve = merge(curve1, curve2)
    if (mergeCurve) {
      expect(mergeCurve.get(1)!.power).toEqual(160)
      expect(mergeCurve.get(2)!.power).toEqual(155)
      expect(mergeCurve.get(4)!.power).toEqual(145)
      expect(mergeCurve.get(10)!.power).toEqual(125)
      expect(mergeCurve.timePoints).toEqual(curve1.timePoints)
      expect(mergeCurve.timePoints).toEqual(curve2.timePoints)
    }
  })

  test('label segments according to source', () => {
    const mergeCurve = merge(curve1, curve2)

    expect(mergeCurve.get(1)!.label).toEqual('training2')
    expect(mergeCurve.get(2)!.label).toEqual('training2')
    expect(mergeCurve.get(3)!.label).toEqual('training2')
    expect(mergeCurve.get(4)!.label).toEqual('training2')
    expect(mergeCurve.get(10)!.label).toEqual('training1')
  })

  test('label can be over-ridden when merged', () => {
    const mergeCurve = merge(curve1, curve2, 'curve1', 'curve2')

    expect(mergeCurve.get(1)!.label).toEqual('curve2')
    expect(mergeCurve.get(2)!.label).toEqual('curve2')
    expect(mergeCurve.get(4)!.label).toEqual('curve2')
    expect(mergeCurve.get(10)!.label).toEqual('curve1')
  })

  test('can merge array of powerCurves', () => {
    const mergeCurve = mergeAll([curve1, curve2, curve3])
    expect(mergeCurve.get(1)!.label).toEqual('training2')
    expect(mergeCurve.get(9)!.label).toEqual('training1')
    expect(mergeCurve.get(10)!.label).toEqual('training3')
  })

  test('can override label while merging array', () => {
    const mergeCurve = mergeAll([curve1, curve2, curve3], 'last week')

    expect(mergeCurve.get(1)!.label).toEqual('last week')
    expect(mergeCurve.get(9)!.label).toEqual('last week')
    expect(mergeCurve.get(10)!.label).toEqual('last week')
  })
})
