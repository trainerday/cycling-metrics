/// <reference types="jest" />
import {StravaToCyclingMetricsConverter, PowerDurationCurve} from "../src/index";
import data from './sampleResponseStream.json';

describe("Strava to Cycling Metrics converter", () => {
    test("smoke test", () => {
        const time = [1,2,3,4];
        const power = [110,120,130,140];
        const hr = [90,92,93,94];
        expect(StravaToCyclingMetricsConverter(time, power, hr))
        .toEqual( [{time:1,power:110,heartRate:90}, 
                   {time:2,power:120,heartRate:92},
                   {time:3,power:130,heartRate:93},
                   {time:4,power:140,heartRate:94}]);
    });

    test("assert works on sample response stream", () => {
        const time = <number[]> data.filter( x => x.type === 'time')[0].data;
        const hr = <number[]> data.filter( x => x.type === 'heartrate')[0].data;
        const power = <number[]> data.filter( x => x.type === 'watts')[0].data;
        expect(StravaToCyclingMetricsConverter(time, power, hr))
        .toHaveLength(3125);
    });
    
    test("different lenths should throw", () => {
        const time = [1,2];
        const power = [110];
        const hr = [90,92,93];
        expect(() => StravaToCyclingMetricsConverter(time, power, hr))
        .toThrow();
    })
  });

  describe("Power duration curve", () => {
    test("should decrease linearly for linear power", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [110,109,108,107,106,105,104,103,102,101,100];
        const hr = new Array(11).fill(100);;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        expect(PowerDurationCurve(metrics))
        .toEqual([undefined,110,109,108,107,106,105,104,103,102,101]);
    });

    test("should be const for const power", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [110,110,110,110,110,110,110,110,110,110,110];
        const hr = new Array(11).fill(100);;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        expect(PowerDurationCurve(metrics))
        .toEqual([undefined,110,110,110,110,110,110,110,110,110,110]);
    });

    test("should descrease gradually for bell-like power spike", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [110,110,112,112,114,116,114,112,112,110,110];
        const hr = new Array(11).fill(100);;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        expect(PowerDurationCurve(metrics))
        .toEqual([undefined,116,114,114,112,112,112,112,110,110,110]);
    });

    test("should interpolate undefined power value lineary", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [undefined,110,112,112,undefined,116,undefined,112,112,110,undefined];
        const hr = new Array(11).fill(100);;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        expect(PowerDurationCurve(metrics))
        .toEqual([undefined,116,114,114,112,112,112,112,110,110,110]);
    });

    test("should interpolate missing Metrics points lineary", () => {
        const time = [0,10];
        const power = [110,100];
        const hr = new Array(11).fill(100);;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        expect(PowerDurationCurve(metrics))
        .toEqual([undefined,110,109,108,107,106,105,104,103,102,101]);
    });

    test("sample response stream", () => {
        const time = <number[]> data.filter( x => x.type === 'time')[0].data;
        const hr = <number[]> data.filter( x => x.type === 'heartrate')[0].data;
        const power = <number[]> data.filter( x => x.type === 'watts')[0].data;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr).filter( m => m.power != undefined);
        
        const powerCurve = PowerDurationCurve(metrics);

        const min = Math.min.apply(null, power);
        const max = Math.max.apply(null, power);

        powerCurve.forEach(power => {
            expect(power).toBeLessThanOrEqual(max);
            expect(power).toBeGreaterThanOrEqual(min);
        });
    });
  });