import { MetricsPoint } from "../metrics/index";

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

export const getMeanMaxPower = ( cycleMetrics : Array<MetricsPoint>) => {
    const length = cycleMetrics.length;
    var result = new Array<number>(length);
    for(var i =1; i <= length; i++ )
    {
        result[i] = getMaxPowerForInterval(cycleMetrics, i);
    }
    return result;
}