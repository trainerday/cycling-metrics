import { getCleanHrSecondsArray } from './index'

describe('HR Array Tests', () => {
  test('Should return the same array as it started.', () => {
    const cleanArray = getCleanHrSecondsArray([])
    expect(cleanArray).toEqual([])
  })
})
