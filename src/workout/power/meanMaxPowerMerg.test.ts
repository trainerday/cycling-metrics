import { drop, range } from 'lodash'
import { MeanMaxPower } from '../../models/meanMaxPower'
import { getMergedCurveFromTwoCurves } from './meanMaxPowerMerge'
import { getPowerDurationCurveSimpleMMP } from './meanMaxPowerCurve'
  
describe('Power duration curve', () => {
  test('should decrease linearly for linear power2', () => {
    const power = [120, 140, 160]
    const power2 = [120, 140, 160]
    const mmp = new MeanMaxPower(power)
    const mmp2 = new MeanMaxPower(power2)

    const curve1 = getPowerDurationCurveSimpleMMP(mmp.timePoints, mmp.timeLength, mmp.powerCurvePoints)
    const curve2 = getPowerDurationCurveSimpleMMP(mmp2.timePoints, mmp2.timeLength, mmp2.powerCurvePoints)
    const curveFinal = getMergedCurveFromTwoCurves(curve1, curve2)
    //console.log(curveFinal)
    expect(curveFinal.powerCurvePoints[0].power).toEqual(160)
  })
})
