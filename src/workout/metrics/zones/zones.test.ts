import { getWorkoutFromSegments } from '../getWorkoutsFromSegments';
import { getDominantZone, getTimeInZone } from './zones';
import { getSegmentsFromArray } from '../getSegmentsFromArray';

describe('getTimeInZone', () => {
  test('should return 1h for ftp const ride', () => {
    const workout = getWorkoutFromSegments([[60, 200, 200]])
    const results = getTimeInZone(200, [...getSegmentsFromArray(workout.segments)])
    expect(results.z4).toEqual(3600)
  })
})

describe('getDominantZone', () => {
  test('Should return zone 4 for ftp ride', () => {
    const workout = getWorkoutFromSegments([[60, 200, 200]])
    const results = getDominantZone(200, [...getSegmentsFromArray(workout.segments)])
    expect(results).toEqual(4)
  })
  test('Should ignore lower zones if time spent in higher is long enough', () => {
    const workout = getWorkoutFromSegments([[60, 120, 120], [1, 250, 250]])
    const results = getDominantZone(200, [...getSegmentsFromArray(workout.segments)])
    expect(results).toEqual(6)
  })
  test('Should return zone2 if time spent in higher is small', () => {
    const workout = getWorkoutFromSegments([[60, 120, 120], [1, 230, 230]])
    const results = getDominantZone(200, [...getSegmentsFromArray(workout.segments)])
    expect(results).toEqual(2)
  })
})