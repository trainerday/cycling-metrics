import { getWorkoutFromSegments } from '../workout/metrics/getWorkoutsFromSegments'
import { movingAverage } from './movingAverage'
import { getSegmentsFromArray } from '../workout/metrics/getSegmentsFromArray'

describe('moving average test', () => {
  test('Moving average on the ramp', () => {
    const workout = getWorkoutFromSegments([[2, 10, 250]])
    const avg = movingAverage(getSegmentsFromArray(workout.segments), 10)
    expect(avg[0]).toEqual((10 + 12 + 14 + 16 + 18 + 20 + 22 + 24 + 26 + 28) / 10)
    expect(avg[1]).toEqual((12 + 14 + 16 + 18 + 20 + 22 + 24 + 26 + 28 + 30) / 10)
    expect(avg[2]).toEqual((14 + 16 + 18 + 20 + 22 + 24 + 26 + 28 + 30 + 32) / 10)
  })
})
