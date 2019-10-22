import { getWorkoutIntervalsFromSegments } from '../getWorkoutsFromSegments'
import { getDominantZone, getTimeInZone } from './zones'
import { getSegmentsFromArray } from '../getSegmentsFromArray'

describe('getTimeInZone', () => {
  test('should return 1h for ftp const ride', () => {
    const segments = getWorkoutIntervalsFromSegments([[60, 200, 200]])
    const results = getTimeInZone(200, getSegmentsFromArray(segments))
    expect(results.z4).toEqual(3600)
  })
})

describe('getDominantZone', () => {
  test('Should return zone 4 for ftp ride', () => {
    const segments = getWorkoutIntervalsFromSegments([[60, 100, 100]])
    const results = getDominantZone(100, getSegmentsFromArray(segments))
    expect(results).toEqual(4)
  })
  test('Should return zone 4 for ftp ride', () => {
    const segments = getWorkoutIntervalsFromSegments([[20, 100, 100]])
    const results = getDominantZone(100, getSegmentsFromArray(segments))
    expect(results).toEqual(4)
  })
  test('Should return zone 6', () => {
    const segments = getWorkoutIntervalsFromSegments([[20, 160, 160]])
    const results = getDominantZone(100, getSegmentsFromArray(segments))
    expect(results).toEqual(6)
  })
  test('Should ignore lower zones if time spent in higher is long enough', () => {
    const segments = getWorkoutIntervalsFromSegments([[60, 60, 60], [3, 125, 125]])
    const results = getDominantZone(100, getSegmentsFromArray(segments))
    expect(results).toEqual(6)
  })
  test('Should return zone2 if time spent in higher is small', () => {
    const segments = getWorkoutIntervalsFromSegments([[60, 60, 60], [1, 100, 100]])
    const results = getDominantZone(100, getSegmentsFromArray(segments))
    expect(results).toEqual(2)
  })
})
