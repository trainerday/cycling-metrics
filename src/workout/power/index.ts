import { find, findLast,keyBy, maxBy } from "lodash";
import { MetricsPoint } from "../common/metricsPoint";

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

const interpolateMissingPowerValues = (cycleMetrics : MetricsPoint[]) => {
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

const interpolateMissingTimePoints = (cycleMetrics : MetricsPoint[]) => {
    const maxTime = maxBy(cycleMetrics, m => m.time).time;
    const metricsLookup = keyBy(cycleMetrics, m => m.time); 

    const result = new Array<MetricsPoint>();
    for(let i = 0; i <= maxTime; i++){
        if( metricsLookup[i] !== undefined){
            result.push(metricsLookup[i]);
        }
        else {
            result.push(new MetricsPoint(i, undefined, undefined));
        }
    }
    return result;
}

export const getMeanMaxPower = ( cycleMetrics : MetricsPoint[]) => {
    const continousTime = interpolateMissingTimePoints(cycleMetrics);
    interpolateMissingPowerValues(continousTime);

    const length = continousTime.length;
    const result = new Array<number>(length);
    for(let i = 1; i <= length; i++ )
    {
        result[i] = getMaxPowerForInterval(continousTime, i);
    }
    return result;
}