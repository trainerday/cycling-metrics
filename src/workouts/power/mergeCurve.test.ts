import { getMergedCurve, getSecondCurveBests } from './mergeCurve'

describe('getMergedCurve - Should be greatest of both', () => {
  test('simple', () => {
    const curve = getMergedCurve([1200, 500, 200], [1100, 499, 201, 199])
    expect(curve).toEqual([1200, 500, 201, 199])
  })
})

describe('getSecondCurveBests - Should be only the bests in number 2', () => {
  test('simple', () => {
    const curve = getSecondCurveBests([1200, 500, 200], [1100, 499, 201, 199])
    expect(curve).toEqual([201, 199])
  })
})


