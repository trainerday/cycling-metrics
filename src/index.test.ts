import { MeanMaxPower } from './models/meanMaxPower'
import { getPowerDurationCurveSimple } from './workout/power/meanMaxPowerCurve'
import { getMeanMaxPowerCurve, getTrainingStress } from './index'


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
})

