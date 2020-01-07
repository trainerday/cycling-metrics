import { getAtl, convertWeeksToDays } from './atl'
import _ from 'lodash'

describe('TSB', () => {
  test('should return array the same length as data', () => {
    const dailyTotals = convertWeeksToDays([70, 70, 70])
    const result = getAtl(0, dailyTotals)
    expect(result).toHaveLength(24)
  })
})
