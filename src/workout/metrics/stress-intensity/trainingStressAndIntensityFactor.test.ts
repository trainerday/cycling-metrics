import { getTrainingStress } from './trainingStressAndIntensityFactor'
import { getWorkoutIntervalsFromSegments } from '../getWorkoutsFromSegments'
import { getSegmentsFromArray } from '../getSegmentsFromArray'

describe('TSS', () => {
  test('zero length array should be 0', () => {
    const res = getTrainingStress(100, [])
    expect(res).toEqual(0)
  })
  test('60min @ 100% of FTP should be 100 tss points', () => {
    const segments = getWorkoutIntervalsFromSegments([[60, 100, 100]])
    const res = getTrainingStress(100, getSegmentsFromArray(segments))
    expect(res).toEqual(100)
  })
  test('60min @ 20-100% of FTP should be 36 tss points', () => {
    const segments = getWorkoutIntervalsFromSegments([[60, 20, 100]])
    const res = getTrainingStress(100, getSegmentsFromArray(segments))
    expect(res).toEqual(49)
  })
  test('spinner workout should be 72', () => {
    const testData = getTestData()
    const segments = getWorkoutIntervalsFromSegments(testData)
    const res = getTrainingStress(100, getSegmentsFromArray(segments))
    expect(res).toEqual(71)
  })
})

function getTestData(): [number, number, number][] {
  return [
    [1, 50, 50],
    [1, 40, 40],
    [1, 70, 70],
    [1, 40, 40],
    [1, 60, 60],
    [1, 40, 40],
    [1, 90, 90],
    [1, 40, 40],
    [1, 80, 80],
    [1, 40, 40],
    [1, 110, 110],
    [1, 40, 40],
    [1, 100, 100],
    [1, 40, 40],
    [1, 130, 130],
    [1, 40, 40],
    [1, 120, 120],
    [3, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [1, 30, 30],
    [1, 120, 120],
    [5, 40, 40],
  ]
}
