import { convertStravaToWorkoutMetrics } from '../converter/convertStravaToCyclingMetrics'
import * as metrics from './workoutStatistics'
import { getWorkoutFromSegments } from './getWorkoutsFromSegments'
import { getSegmentsFromArray } from './getSegmentsFromArray'

describe('getWorkoutStatistics', () => {
  const spinnerData: Array<[number, number, number]> = [
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
    [5 - 1 / 60, 40, 40],
    [1 / 60, 40, 40],
  ]

  test('spinner workout for 100 FTP', () => {
    const spinner = getWorkoutFromSegments(spinnerData)
    const results = metrics.getWorkoutStats(100, [...getSegmentsFromArray(spinner.segments)])
    expect(results).toEqual({
      DominantZone: 5,
      Intensity: 0.878,
      TimeZone1: 1920, //TODO Alex I changed this from TimeZone1_2 to TimeZone1
      TimeZone2: 120,
      TimeZone3: 120,
      TimeZone4: 60,
      TimeZone5: 1080,
      TimeZone6: 60,
      TotalMinutes: 56,
      TotalStress: 72,
    })
  })

  test('Can calculate workout on Strava output', () => {
    const time: any = []
    const power: any = []
    let sum = 0
    spinnerData.forEach(x => {
      time.push(sum)
      power.push(x[1])
      sum += x[0] * 60
      time.push(sum - 1)
      power.push(x[2])
    })
    const workoutMetrics = convertStravaToWorkoutMetrics(time, power)
    const results = metrics.getWorkoutStats(100, [...workoutMetrics])
    expect(results.DominantZone).toEqual(5)
    expect(results.Intensity).toEqual(0.878)
    expect(results.TimeZone1).toEqual(1920)
    expect(results.TimeZone2).toEqual(120)
    expect(results.TimeZone3).toEqual(120)
    expect(results.TimeZone4).toEqual(60)
    expect(results.TimeZone5).toEqual(1080)
    expect(results.TimeZone6).toEqual(60)
    expect(results.TotalMinutes).toEqual(56)
    expect(results.TotalStress).toEqual(72)
  })
})
