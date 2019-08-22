import * as utils from "../common/utils"
import * as common from "../common/index"
import * as metrics from "./index"
import * as _ from 'lodash'
import { convertStravaToWorkoutMetrics } from "../converter";
import { exportAllDeclaration } from "@babel/types";

describe("Workout", () => {
    test("Moving average on the ramp", () =>{
        const workout = common.Workout.FromArray([[2, 10, 250]]);
        const avg = utils.movingAverage(workout, 10);
        expect(avg[0]).toEqual((10+12+14+16+18+20+22+24+26+28)/10);
        expect(avg[1]).toEqual((12+14+16+18+20+22+24+26+28+30)/10);
        expect(avg[2]).toEqual((14+16+18+20+22+24+26+28+30+32)/10);        
    })
})

describe("TSS", () => {
    test("zero length array should be 0", () => {
        const res = metrics.getTss(100, [])
        expect(res).toEqual(0)
    })    
    test("60min @ 100% of FTP should be 100 tss points", () => {
        const workout = common.Workout.FromArray([[60,100,100]])
        const res = metrics.getTss(100, [...workout])
        expect(res).toEqual(100)
    })    
    test("60min @ 20-100% of FTP should be 36 tss points", () => {
        const workout = common.Workout.FromArray([[60,20,100]])
        const res = metrics.getTss(100, [...workout])
        expect(res).toEqual(50)
    })  
    test("spinner workout should be 72", () => {
        const spinner = common.Workout.FromArray([[1,50,50],[1,40,40],[1,70,70],[1,40,40],[1,60,60],[1,40,40],[1,90,90],[1,40,40],[1,80,80],[1,40,40],[1,110,110],[1,40,40],[1,100,100],[1,40,40],[1,130,130],[1,40,40],[1,120,120],[3,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[5,40,40]])
        const res = metrics.getTss(100, [...spinner])
        expect(res).toEqual(72)
    })  
})

describe("GetTimeInZone", () => {
    test("should return 1h for ftp const ride", () => {
        const workout = common.Workout.FromArray([[60,200,200]])
        const results = metrics.GetTimeInZone(200, [...workout])
        expect(results.z4).toEqual(3600)
    })
})

describe("GetDominantZone", () => {
    test("Should return zone 4 for ftp ride", () => {
        const workout = common.Workout.FromArray([[60,200,200]])
        const results = metrics.GetDominantZone(200, [...workout])
        expect(results).toEqual(4)
    })
    test("Should ignore lower zones if time spent in higher is long enough",() => {
        const workout = common.Workout.FromArray([[60,120,120], [1, 250, 250]])
        const results = metrics.GetDominantZone(200, [...workout])
        expect(results).toEqual(6)
    })
    test("Should return zone2 if time spent in higher is small",() => {
        const workout = common.Workout.FromArray([[60,120,120], [1, 230, 230]])
        const results = metrics.GetDominantZone(200, [...workout])
        expect(results).toEqual(2)
    })
})

describe("GetWorkoutStatistics", () => {
    let spinnerData: Array<[number,number,number]> = [[1,50,50],[1,40,40],[1,70,70],[1,40,40],[1,60,60],[1,40,40],[1,90,90],[1,40,40],[1,80,80],[1,40,40],[1,110,110],[1,40,40],[1,100,100],[1,40,40],[1,130,130],[1,40,40],[1,120,120],[3,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[5-1/60,40,40],[1/60,40,40]]
 
    test("spinner workout for 100 FTP", () => {
        const spinner = common.Workout.FromArray(spinnerData)
        const results = metrics.GetWorkoutStats (100, [...spinner])
        expect(results).toEqual({
            DominantZone:5,
            Intensity:0.878,
            TimeZone1_2:1920,
            TimeZone3:120,
            TimeZone4:60,
            TimeZone5:1080,
            TimeZone6:60,
            TotalMinutes:56,
            TotalStress:72,
        })
    })

    test("Can calculate workout on Strava output", () =>{
        const time = [];
        const power = [];
        var sum = 0;
        spinnerData.forEach( x => {
            time.push(sum)
            power.push(x[1])
            sum += x[0] * 60
            time.push(sum - 1)
            power.push(x[2])
        })   
        const workoutMetrics = convertStravaToWorkoutMetrics(time, power, null);
        const results = metrics.GetWorkoutStats (100, [...workoutMetrics])
        expect(results).toEqual({
            DominantZone:5,
            Intensity:0.878,
            TimeZone1_2:1920,
            TimeZone3:120,
            TimeZone4:60,
            TimeZone5:1080,
            TimeZone6:60,
            TotalMinutes:56,
            TotalStress:72,
        })
    })
})

