import { convertStravaToCyclingMetrics } from './index';

describe('Strava to Cycling Metrics converter', () => {
  test('smoke test', () => {
    const time = [1, 2, 3, 4];
    const power = [110, 120, 130, 140];
    const hr = [90, 92, 93, 94];
    expect(convertStravaToCyclingMetrics(time, power, hr)).toEqual([
      { time: 1, power: 110, heartRate: 90 },
      { time: 2, power: 120, heartRate: 92 },
      { time: 3, power: 130, heartRate: 93 },
      { time: 4, power: 140, heartRate: 94 },
    ]);
  });

  test('different lenths should throw', () => {
    const time = [1, 2];
    const power = [110];
    const hr = [90, 92, 93];
    expect(() => convertStravaToCyclingMetrics(time, power, hr)).toThrow();
  });
});

describe('Null HR and Power Arrays for Strava Conversion', () => {
  test('Null HR should be fine', () => {
    const time = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const power = [110, 110, 110, 110, 110, 120, 120, 120, 120, 120, 120];
    const hr = null;
    const metrics = convertStravaToCyclingMetrics(time, power, hr);
    expect(metrics.length).toEqual(11);
  });
  test('Null Power should be fine', () => {
    const time = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const power = null;
    const hr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const metrics = convertStravaToCyclingMetrics(time, power, hr);
    expect(metrics.length).toEqual(11);
  });
});
