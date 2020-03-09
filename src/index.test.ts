import { getMeanMaxPowerCurve, getTrainingStress,getMergedCurve } from './index'
import _ from 'lodash'

describe('Index', () => {
  test('power duration curve', () => {
    const power = [102, 106, 110, 114, 118, 120, 116, 112, 108, 104, 100]
    const curve = getMeanMaxPowerCurve(power)
    expect(curve).toEqual([120,119,118,117,116,115,114,113,112,111,110])
  })
  test('training stress', () => {
    const intervals: [number, number, number] [] = [[60,200,200]] // minutes, wattsStart, wattsEnd
    const trainingStress = getTrainingStress(intervals, 200)
    expect(trainingStress).toEqual(100)
  })
  test('mergedCurve', () => {
    const pow1 = _.range(1,10000)
    const pow2 = _.range(1,10000)
    const curve = getMergedCurve(pow1, pow2)
    expect(curve.length).toEqual(10000-1)
  })
})

