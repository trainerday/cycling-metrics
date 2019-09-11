import * as _ from 'lodash';
import {Workout} from '../common/workout';
import * as utils from '../common/utils';
import { convertStravaToWorkoutMetrics } from '../converter';
import * as metrics from './index';

describe('Workout', () => {
  test('Moving average on the ramp', () => {
    const workout = Workout.FromArray([[2, 10, 250]]);
    const avg = utils.movingAverage(workout, 10);
    expect(avg[0]).toEqual((10 + 12 + 14 + 16 + 18 + 20 + 22 + 24 + 26 + 28) / 10);
    expect(avg[1]).toEqual((12 + 14 + 16 + 18 + 20 + 22 + 24 + 26 + 28 + 30) / 10);
    expect(avg[2]).toEqual((14 + 16 + 18 + 20 + 22 + 24 + 26 + 28 + 30 + 32) / 10);
  });
});

describe('TSS', () => {
  test('zero length array should be 0', () => {
    const res = metrics.getTss(100, []);
    expect(res).toEqual(0);
  });
  test('60min @ 100% of FTP should be 100 tss points', () => {
    const workout = Workout.FromArray([[60, 100, 100]]);
    const res = metrics.getTss(100, [...workout]);
    expect(res).toEqual(100);
  });
  test('60min @ 20-100% of FTP should be 36 tss points', () => {
    const workout = Workout.FromArray([[60, 20, 100]]);
    const res = metrics.getTss(100, [...workout]);
    expect(res).toEqual(50);
  });
  test('spinner workout should be 72', () => {
    const spinner = Workout.FromArray([
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
    ]);
    const res = metrics.getTss(100, [...spinner]);
    expect(res).toEqual(72);
  });
});

describe('GetTimeInZone', () => {
  test('should return 1h for ftp const ride', () => {
    const workout = Workout.FromArray([[60, 200, 200]]);
    const results = metrics.GetTimeInZone(200, [...workout]);
    expect(results.z4).toEqual(3600);
  });
});

describe('GetDominantZone', () => {
  test('Should return zone 4 for ftp ride', () => {
    const workout = Workout.FromArray([[60, 200, 200]]);
    const results = metrics.GetDominantZone(200, [...workout]);
    expect(results).toEqual(4);
  });
  test('Should ignore lower zones if time spent in higher is long enough', () => {
    const workout = Workout.FromArray([[60, 120, 120], [1, 250, 250]]);
    const results = metrics.GetDominantZone(200, [...workout]);
    expect(results).toEqual(6);
  });
  test('Should return zone2 if time spent in higher is small', () => {
    const workout = Workout.FromArray([[60, 120, 120], [1, 230, 230]]);
    const results = metrics.GetDominantZone(200, [...workout]);
    expect(results).toEqual(2);
  });
});

describe('GetWorkoutStatistics', () => {
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
  ];

  test('spinner workout for 100 FTP', () => {
    const spinner = Workout.FromArray(spinnerData);
    const results = metrics.GetWorkoutStats(100, [...spinner]);
    expect(results).toEqual({
      DominantZone: 5,
      Intensity: 0.878,
      TimeZone1_2: 1920,
      TimeZone3: 120,
      TimeZone4: 60,
      TimeZone5: 1080,
      TimeZone6: 60,
      TotalMinutes: 56,
      TotalStress: 72,
    });
  });

  test('Can calculate workout on Strava output', () => {
    const time = [];
    const power = [];
    let sum = 0;
    spinnerData.forEach(x => {
      time.push(sum);
      power.push(x[1]);
      sum += x[0] * 60;
      time.push(sum - 1);
      power.push(x[2]);
    });
    const workoutMetrics = convertStravaToWorkoutMetrics(time, power, null);
    const results = metrics.GetWorkoutStats(100, [...workoutMetrics]);
    expect(results).toEqual({
      DominantZone: 5,
      Intensity: 0.878,
      TimeZone1_2: 1920,
      TimeZone3: 120,
      TimeZone4: 60,
      TimeZone5: 1080,
      TimeZone6: 60,
      TotalMinutes: 56,
      TotalStress: 72,
    });
  });

  describe("Ctl", () => {
    test("should return array the same length as data", () => {
      const data = [490,580,670,410,610,420,590,680,770,510,710,800,890,630,830,920]
      const startingStress = 400;
      const result = metrics.GetTrainingStressBalance(startingStress, data);
      expect(result).toHaveLength(16*7)
    })
  })
});
