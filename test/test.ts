/// <reference types="jest" />
import {StravaToCyclingMetricsConverter} from "../src/index";
import data from './sampleResponseStream.json';

describe("Strava to Cycling Metrics converter", () => {
    test("smoke test", () => {
        var time = [1,2,3,4];
        var power = [110,120,130,140];
        var hr = [90,92,93,94];
        expect(StravaToCyclingMetricsConverter(time, power, hr))
        .toEqual( [[1,110,90], [2,120,92],[3,130,93], [4,140,94]]);
    });

    test("assert works on sample response stream", () => {
        const time = <number[]> data.filter( x => x.type === 'time')[0].data;
        const hr = <number[]> data.filter( x => x.type === 'heartrate')[0].data;
        const power = <number[]> data.filter( x => x.type === 'watts')[0].data;
        expect(StravaToCyclingMetricsConverter(time, power, hr))
        .toHaveLength(3125);
    });
    
    test("different lenths should throw", () => {
        var time = [1,2];
        var power = [110];
        var hr = [90,92,93];
        expect(() => StravaToCyclingMetricsConverter(time, power, hr))
        .toThrow();
    })
  });