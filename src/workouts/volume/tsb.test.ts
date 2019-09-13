import { getTrainingStressBalance } from './tsb'

describe('Ctl', () => {
  test('should return array the same length as data', () => {
    const data = [490, 580, 670, 410, 610, 420, 590, 680, 770, 510, 710, 800, 890, 630, 830, 920]
    const startingStress = 400
    const result = getTrainingStressBalance(startingStress, data)
    expect(result).toHaveLength(16 * 7)
  })
})
