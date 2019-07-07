import { zipWith } from "lodash";

export interface MetricsPoint {
    time: Number;
    power: Number;
    heartRate: Number;
}

export const StravaToCyclingMetricsConverter = (secondsArr : Array<Number>, powerArr:Array<Number>, hrArray :Array<Number>) => {
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
    
    return zipWith<Number,Number,Number, MetricsPoint>(secondsArr, powerArr, hrArray, (s,p,h) => {return {time:s, power: p, heartRate:h}});
}