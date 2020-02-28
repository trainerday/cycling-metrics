import { getTrainingStressBalance } from './tsb'
import { convertWeeksToDays, getAtl } from './atl'
import { getCtl } from './ctl'

describe('TSB', () => {
  test('should return array the same length as data', () => {

    const dailyTotals = convertWeeksToDays([70, 70, 70])
    const ctl = getCtl(dailyTotals, 0,0)
    const atl = getAtl(0, dailyTotals)
    const result = getTrainingStressBalance(0, 0, ctl, atl)
    //console.log(result)
    expect(result).toHaveLength(25)
  })

})
