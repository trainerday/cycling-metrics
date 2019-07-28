import { dropWhile, find, findLast, first, keyBy, maxBy, range, uniq } from "lodash";
import { MetricsPoint } from "../common/metricsPoint";
import { thisTypeAnnotation } from "@babel/types";


class PowerCurvePoint{
    public time : number;
    public power : number;
    public label : string;
  }  

export function generateLogScale (logscale: number, timeLength : number) {
    const points = new Array<number>();
    var current = 1;
    while (current < timeLength) {
        points.push(current);
        current = Math.ceil(current * logscale);
    }
    return points;
}

export class MeanMaxPower {
    private curve : PowerCurvePoint[];
    private timePoints : number[];
    private timeLength : number;

    constructor (cycleMetrics : MetricsPoint[], timePoints? : number[], label? : string){
        const labelValue = label === undefined ? "defaultLabel" : label;
        const continousTime = this.interpolateMissingTimePoints(cycleMetrics);
        this.interpolateMissingPowerValues(continousTime);
        this.timeLength = continousTime.length;
        this.timePoints = timePoints !== undefined ? timePoints : this.getDefaultTimePoints();
        this.curve = this.buildCurve(continousTime, labelValue);
    }

    private buildCurve(continousTime: MetricsPoint[], label: string) {
        let prevValue = this.getMaxPowerForInterval(continousTime, 1);
        let prevTime = first (this.timePoints);
        const result = new Array<PowerCurvePoint>();
        this.timePoints.forEach(time => {
            let powerValue = this.getMaxPowerForInterval(continousTime, time);
            if(prevValue !== powerValue){
                result.push({time: prevTime, power: prevValue, label: label});
              }
            prevValue = powerValue;
            prevTime = time;
        }) 
        result.push({time: this.timeLength+1, power: prevValue, label: label});
        return result;
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

  // private binaryGet(lo: number, hi: number, time: number){
  //   while(lo < hi){
  //     const mid = Math.floor((lo+hi) / 2);
  //     if(this.curve[mid].time < time)
  //       lo = mid + 1;
  //     else if(this.curve[mid].time > time)
  //       hi = mid - 1;
  //     else return this.curve[mid].power;
  //   }
  //   return this.curve[lo].power;
  // }

    static Merge(curve1: MeanMaxPower, curve2: MeanMaxPower) : MeanMaxPower {
        const curve1Iter = curve1.curve.values();
        const curve2Iter = curve2.curve.values();
        var value1 = curve1Iter.next();
        var value2 = curve2Iter.next();

        const result = new Array<PowerCurvePoint>();
        do {
           if(value1.value.time === value2.value.time) {
               result.push(value1.value.power > value2.value.power ? value1.value : value2.value);
               value1 = curve1Iter.next();
               value2 = curve2Iter.next();
           }        
           else if(value1.value.time < value2.value.time){
                if(value1.value.power > value2.value.power){
                    result.push(value1.value);
                }
                value1 = curve1Iter.next();
           }
           else if(value1.value.time > value2.value.time){
                if(value1.value.power < value2.value.power) {
                    result.push(value2.value);
                }
                value2 = curve2Iter.next();
            }   
        } while(!value1.done && !value2.done);
        while(!value1.done){ result.push(value1.value); value1 = curve1Iter.next(); }
        while(!value2.done){ result.push(value2.value); value2 = curve2Iter.next(); }

        const timePoints = uniq([...curve1.TimePoints, ...curve2.TimePoints]).sort((n1,n2) => n1-n2);
        let curve = new MeanMaxPower([new MetricsPoint(0,0,0)]);
        curve.curve = result;
        curve.timePoints = timePoints;
        curve.timeLength = timePoints.length;
        return curve;
    } 

    public get(time: number) {
        if(time > this.timeLength || time < 0) {
            return undefined;
        }
        return first (dropWhile(this.curve, x => x.time < time));
    }

    private getDefaultTimePoints(){
        const logscale = 1.5;
        const fixedPoints = range(1, Math.min(20, this.timeLength+1));
        const logPoints = generateLogScale(logscale, this.timeLength);
        return uniq ([...fixedPoints, ...logPoints]).sort((n1,n2) => n1-n2);
    }

    public get Curve(): number[] {
        return [undefined, ...this.timePoints.map(x => this.get(x).power)];
    }
    public get TimePoints() : number[] {
        return this.timePoints;
    }
}
