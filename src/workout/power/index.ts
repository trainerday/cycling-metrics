import { find, findLast } from "lodash";
import { MetricsPoint } from "../common/MetricsPoint";

const getMaxPowerForInterval = (cycleMetrics: MetricsPoint[], intervalLength ) => {
    let max = 0;
    let sum = 0;
    for(let i=0; i < intervalLength; i++){
        sum += cycleMetrics[i].power;
    }
    max = Math.max(max, sum);
    for(let i=intervalLength; i < cycleMetrics.length; i++){
        sum -=  cycleMetrics[i-intervalLength].power;
        sum +=  cycleMetrics[i].power;
        max = Math.max(max, sum);
    }
    return max / intervalLength;
}

const interpolateMissingPowerValues  = (cycleMetrics : MetricsPoint[]) => {
    const headValue = find(cycleMetrics, point => point.power !== undefined).power;
    const tailValue = findLast(cycleMetrics, point => point.power !== undefined).power;
    // extrapolate on the edges to a const
    for (let i = 0; cycleMetrics[i].power === undefined; i++) {
        cycleMetrics[i].power = headValue;   
    }
    for (let i = cycleMetrics.length - 1; cycleMetrics[i].power === undefined; i--) {
        cycleMetrics[i].power = tailValue;     
    }
    // interpolate holes lineary
    for (let i = 1; i < cycleMetrics.length - 1; i++) {
         if(cycleMetrics[i].power === undefined) {
             const lidx = i - 1;
             let ridx = i + 1;          
             while ( cycleMetrics[ridx].power === undefined) { ridx++; }
             const lvalue = cycleMetrics[lidx].power;
             const rvalue = cycleMetrics[ridx].power;
             cycleMetrics[i].power =  lvalue + (rvalue - lvalue) / (ridx - lidx);
         }    
    }
}

export const getMeanMaxPower = ( cycleMetrics : MetricsPoint[]) => {
    interpolateMissingPowerValues(cycleMetrics);
    const length = cycleMetrics.length;
    const result = new Array<number>(length);
    for(let i = 1; i <= length; i++ )
    {
        result[i] = getMaxPowerForInterval(cycleMetrics, i);
    }
    return result;
}