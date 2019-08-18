import _ from "lodash";
import { MetricsPoint } from "../common/metricsPoint";
import * as utils from "../common/utils";
import { PowerCurvePoint, WithLabel } from "./PowerCurvePoint";

export function generateLogScale (logscale: number, timeLength : number) {
    const points = new Array<number>();
    let current = 1;
    while (current < timeLength) {
        points.push(current);
        current = Math.ceil(current * logscale);
    }
    return points;
}

export class MeanMaxPower {
    public static MergeAll(curves: MeanMaxPower[], label?: string) : MeanMaxPower {
        return curves.reduce((x1,x2) => MeanMaxPower.Merge(x1, x2, label, label));
    }
    public static Merge(curve1: MeanMaxPower, curve2: MeanMaxPower, label1?: string, label2?: string) : MeanMaxPower {
        const curve1Iter = curve1.curve.values();
        const curve2Iter = curve2.curve.values();
        let value1 = curve1Iter.next();
        let value2 = curve2Iter.next();

        const result = new Array<PowerCurvePoint>();
        do {
           if(value1.value.time === value2.value.time) {
               result.push(value1.value.power > value2.value.power 
                            ? WithLabel(value1.value, label1)
                            : WithLabel(value2.value, label2));
               value1 = curve1Iter.next();
               value2 = curve2Iter.next();
           }        
           else if(value1.value.time < value2.value.time){
                if(value1.value.power > value2.value.power){
                    result.push(WithLabel(value1.value, label1));
                }
                value1 = curve1Iter.next();
           }
           else if(value1.value.time > value2.value.time){
                if(value1.value.power < value2.value.power) {
                    result.push(WithLabel(value2.value, label2));
                }
                value2 = curve2Iter.next();
            }   
        } while(!value1.done && !value2.done);
        while(!value1.done){ result.push(WithLabel(value1.value, label1)); value1 = curve1Iter.next(); }
        while(!value2.done){ result.push(WithLabel(value2.value, label2)); value2 = curve2Iter.next(); }

        const timePoints = _.uniq([...curve1.TimePoints, ...curve2.TimePoints]).sort((n1,n2) => n1-n2);
        const curve = new MeanMaxPower([new MetricsPoint(0,0,0)]);
        curve.curve = result;
        curve.timePoints = timePoints;
        curve.timeLength = timePoints.length;
        return curve;
    } 

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

    public get(time: number) {
        const max = _.last(this.timePoints);
        if(time > max || time < 0) {
            return undefined;
        }
        return _.first (_.dropWhile(this.curve, x => x.time < time));
    }

    public get Curve(): number[] {
        return [undefined, ...this.timePoints.map(x => this.get(x).power)];
    }
    
    public get TimePoints() : number[] {
        return this.timePoints;
    }

    private buildCurve(continousTime: MetricsPoint[], label: string) {
        let prevValue = this.getMaxPowerForInterval(continousTime, 1);
        let prevTime = _.first (this.timePoints);
        const result = new Array<PowerCurvePoint>();
        this.timePoints.forEach(time => {
            const powerValue = this.getMaxPowerForInterval(continousTime, time);
            if(prevValue !== powerValue){
                result.push({time: prevTime, power: prevValue, label});
              }
            prevValue = powerValue;
            prevTime = time;
        }) 
        result.push({time: this.timeLength+1, power: prevValue, label});
        return result;
    }

    private getMaxPowerForInterval (cycleMetrics: MetricsPoint[], intervalLength: number) : number {
        const avgs = utils.movingAverage(cycleMetrics.map(x => x.power), intervalLength)
        return _.max(avgs)
    }

    private interpolateMissingPowerValues (cycleMetrics : MetricsPoint[]): void {
        const headValue = _.find(cycleMetrics, point => point.power !== undefined).power;
        const tailValue = _.findLast(cycleMetrics, point => point.power !== undefined).power;
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
        const maxTime = _.maxBy(cycleMetrics, m => m.time).time;
        const metricsLookup = _.keyBy(cycleMetrics, m => m.time); 

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

    private getDefaultTimePoints(){
        const logscale = 1.5;
        const fixedPoints = _.range(1, Math.min(20, this.timeLength+1));
        const logPoints = generateLogScale(logscale, this.timeLength);
        return _.uniq ([...fixedPoints, ...logPoints]).sort((n1,n2) => n1-n2);
    }
}
