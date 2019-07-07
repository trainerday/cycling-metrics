/// <reference types="jest" />
import {StravaToCyclingMetricsConverter} from "../metrics/index";
import {getMeanMaxPower} from "./index";
import data from './sampleResponseStream.json';

  describe("Power duration curve", () => {
    test("should decrease linearly for linear power2", () => {
        const time = [0,1,2];
        const power = [120,140,160];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,160,150,140]);
    });

    test("should decrease linearly for linear power", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [120,118,116,114,112,110,108,106,104,102,100];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("should be const for const power", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [110,110,110,110,110,110,110,110,110,110,110];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,110,110,110,110,110,110,110,110,110,110,110]);
    });

    test("should descrease gradually for bell-like power spike", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [102,106,110,114,118,120,116,112,108,104,100];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("should interpolate undefined power value lineary", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [120,118,116,undefined,112,undefined,undefined,106,104,undefined,100];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("should extrapolate boundary to const", () => {
        const time = [0,1,2];
        const power = [undefined, 120, undefined];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,120,120,120]);
    });

    test.skip("should interpolate missing Metrics points lineary", () => {
        const time = [0,10];
        const power = [110,100];
        const metrics = StravaToCyclingMetricsConverter(time, power, null);
        expect(getMeanMaxPower(metrics))
        .toEqual([undefined,110,109,108,107,106,105,104,103,102,101]);
    });

    test("sample response stream", () => {
        const time = <number[]> data.filter( x => x.type === 'time')[0].data;
        const hr = <number[]> data.filter( x => x.type === 'heartrate')[0].data;
        const power = <number[]> data.filter( x => x.type === 'watts')[0].data;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        
        const powerCurve = getMeanMaxPower(metrics);

        const min = Math.min.apply(null, power);
        const max = Math.max.apply(null, power);

        powerCurve.forEach(power => {
            expect(power).toBeLessThanOrEqual(max);
            expect(power).toBeGreaterThanOrEqual(min);
        });
    });
  });

  describe("Power Average", () => {
    test("should be average power", () => {
        const time = [0,1,2,3,4,5,6,7,8,9];
        const power = [110,110,110,110,110,120,120,120,120,120];
        const hr = null;
        const metrics = StravaToCyclingMetricsConverter(time, power, hr);
        const pdCurve = getMeanMaxPower(metrics);
        expect(pdCurve[1]).toEqual(120);
        expect(pdCurve[2]).toEqual(120);
        expect(pdCurve[4]).toEqual(120);
        expect(pdCurve[10]).toEqual(115);
       // .toEqual([{seconds:1,mma:120},{seconds:2,mma:120},{seconds:4,mma:120},{seconds:10,mma:115}]);
    });
  });


