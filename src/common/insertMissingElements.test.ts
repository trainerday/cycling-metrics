import { insertMissingElementsInSequence } from './insertMissingElements'

describe('moving average test', (): void => {
  test('Moving average on the ramp', (): void => {
    const res = insertMissingElementsInSequence([1, 2, 5, 8], [2, 2, 10, 10])
    expect(res).toEqual([2, 2, 0, 0, 10, 0, 0, 10])
  })
})
