import { MetricsPoint } from "../metrics/index";
import { find, findLast } from "lodash";

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

const interpolateMissingPowerValues  = (cycleMetrics : Array<MetricsPoint>) => {
    let headValue = find(cycleMetrics, point => point.power != undefined).power;
    let tailValue = findLast(cycleMetrics, point => point.power != undefined).power;
    //extrapolate on the edges to a const
    for (let i = 0; cycleMetrics[i].power == undefined; i++) {
        cycleMetrics[i].power = headValue;   
    }
    for (let i = cycleMetrics.length - 1; cycleMetrics[i].power == undefined; i--) {
        cycleMetrics[i].power = tailValue;     
    }
    // interpolate holes lineary
    for (let i = 1; i < cycleMetrics.length - 1; i++) {
         if(cycleMetrics[i].power == undefined) {
             let lidx = i - 1;
             let ridx = i + 1;          
             while ( cycleMetrics[ridx].power == undefined) ridx++;
             let lvalue = <number>cycleMetrics[lidx].power;
             let rvalue = <number>cycleMetrics[ridx].power;
             cycleMetrics[i].power =  lvalue + (rvalue - lvalue) / (ridx - lidx);
         }    
    }

}

export const getMeanMaxPower = ( cycleMetrics : Array<MetricsPoint>) => {
    interpolateMissingPowerValues(cycleMetrics);
    const length = cycleMetrics.length;
    var result = new Array<number>(length);
    for(var i =1; i <= length; i++ )
    {
        result[i] = getMaxPowerForInterval(cycleMetrics, i);
    }
    return result;
}