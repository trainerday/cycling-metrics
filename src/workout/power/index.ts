import { find, findLast,keyBy, maxBy } from "lodash";
import { MetricsPoint } from "../common/metricsPoint";

export class MeanMaxPower {
    private curve : number[];

    constructor (cycleMetrics : MetricsPoint[]){
        const continousTime = this.interpolateMissingTimePoints(cycleMetrics);
        this.interpolateMissingPowerValues(continousTime);
    
        const length = continousTime.length;
        this.curve = new Array<number>(length);
        for(let i = 1; i <= length; i++)
        {
            this.curve[i] = this.getMaxPowerForInterval(continousTime, i);
        }
    }

    private getMaxPowerForInterval (cycleMetrics: MetricsPoint[], intervalLength: number) : number {
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


    private interpolateMissingPowerValues (cycleMetrics : MetricsPoint[]): void {
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

    private interpolateMissingTimePoints (cycleMetrics : MetricsPoint[]): MetricsPoint[] {
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
    public get Curve(): number[] {
        return this.curve;
    }
}
