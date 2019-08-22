import { zipWith } from "lodash"
import { WorkoutMetrics } from "../common/index"
import { MetricsPoint } from "../common/metricsPoint"

export const convertStravaToCyclingMetrics = (secondsArr : number[], powerArr: number[], hrArray : number[]) => {
    // prevent interpolating results array with undefined values

    if (secondsArr === null || secondsArr.length ===0){
        throw Error("seconds array must be longer than 0");
        return;
    }

    if(powerArr !== null && secondsArr.length !== powerArr.length){
        throw Error("if power array is present it must be the same length as seconds array");
        return;
    }
    
    if(hrArray !== null && secondsArr.length !== hrArray.length){
//        console.log(hrArray.length,secondsArr.length)
        throw Error("if hr array is present it must be the same length as seconds array");
        return;
    }
    
    return zipWith<number,number,number, MetricsPoint>(secondsArr, powerArr, hrArray, (s,p,h) => ({time: s, power: p, heartRate: h}));
}

export const convertStravaToWorkoutMetrics = (secondsArr : number[], powerArr: number[], hrArray : number[]) => {
    return new WorkoutMetrics( convertStravaToCyclingMetrics(secondsArr, powerArr, hrArray))
}
