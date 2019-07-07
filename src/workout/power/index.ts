import { zip, zipWith, map} from "lodash";
import Heap from "heap-js";

interface MetricsPoint {
    time: Number;
    power: Number;
    heartRate: Number;
}

const getMaxPowerForInterval = (cycleMetrics: Array<MetricsPoint>, intervalLength ) => {
    var i = 0;
    var max = 0;
    var sum = 0;
    for(i=0; i < intervalLength; i++){
        sum += <number>cycleMetrics[i].power;
    }
    max = Math.max(max, sum);
    for(i=intervalLength; i < cycleMetrics.length; i++){
        sum -=  <number>cycleMetrics[i-intervalLength].power;
        sum +=  <number>cycleMetrics[i].power;
        max = Math.max(max, sum);
    }
    return max / intervalLength;
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

export const PowerDurationCurve = ( cycleMetrics : Array<MetricsPoint>) => {
    const length = cycleMetrics.length;
    var result = new Array<number>(length);
    for(var i =1; i <= length; i++ )
    {
        result[i] = getMaxPowerForInterval(cycleMetrics, i);
    }
    return result;
}