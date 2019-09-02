import _ from 'lodash';
import { MetricsPoint } from '../common/metricsPoint';
import * as utils from '../common/utils';
import { PowerCurvePoint, WithLabel } from './PowerCurvePoint';
import { labeledStatement } from '@babel/types';

export function generateLogScale(logscale: number, timeLength: number) {
  const points = new Array<number>();
  let current = 1;
  while (current < timeLength) {
    points.push(current);
    current = Math.ceil(current * logscale);
  }
  return points;
}

export class MeanMaxPower {
  public static MergeAll(curves: MeanMaxPower[], label?: string): MeanMaxPower {
    return curves.reduce((x1, x2) => MeanMaxPower.Merge(x1, x2, label, label));
  }
  public static Merge(curve1: MeanMaxPower, curve2: MeanMaxPower, label1?: string, label2?: string): MeanMaxPower {
    const curve1Iter = curve1.curve.values();
    const curve2Iter = curve2.curve.values();
    let value1 = curve1Iter.next();
    let value2 = curve2Iter.next();

    const result = new Array<PowerCurvePoint>();
    do {
      if (value1.value.time === value2.value.time) {
        result.push(
          value1.value.power > value2.value.power ? WithLabel(value1.value, label1) : WithLabel(value2.value, label2),
        );
        value1 = curve1Iter.next();
        value2 = curve2Iter.next();
      } else if (value1.value.time < value2.value.time) {
        if (value1.value.power > value2.value.power) {
          result.push(WithLabel(value1.value, label1));
        }
        value1 = curve1Iter.next();
      } else if (value1.value.time > value2.value.time) {
        if (value1.value.power < value2.value.power) {
          result.push(WithLabel(value2.value, label2));
        }
        value2 = curve2Iter.next();
      }
    } while (!value1.done && !value2.done);
    while (!value1.done) {
      result.push(WithLabel(value1.value, label1));
      value1 = curve1Iter.next();
    }
    while (!value2.done) {
      result.push(WithLabel(value2.value, label2));
      value2 = curve2Iter.next();
    }

    const timePoints = _.uniq([...curve1.TimePoints, ...curve2.TimePoints]).sort((n1, n2) => n1 - n2);
    const curve = new MeanMaxPower([0]);
    curve.curve = result;
    curve.timePoints = timePoints;
    curve.timeLength = _.maxBy(result, x => x.time).time;
    return curve;
  }

  private curve: PowerCurvePoint[];
  private timePoints: number[];
  private timeLength: number;

  constructor(powerValues: number[], timePoints?: number[], label?: string) {
    const labelValue = label === undefined ? 'defaultLabel' : label;
    this.timeLength = powerValues.length;
    this.timePoints =
      timePoints !== undefined ? _.filter(timePoints, t => t <= this.timeLength) : this.getDefaultTimePoints();
    this.curve = this.buildCurve(powerValues, labelValue);
  }

  public get(time: number) {
    const max = this.timeLength;
    if (time > max || time < 0) {
      return undefined;
    }
    const tail = _.dropWhile(this.curve, x => x.time < time);
    if (tail.length > 0) {
      return _.first(tail);
    }
    return _.last(this.curve);
  }

  public get Curve(): number[] {
    return this.timePoints.map(x => this.get(x).power);
  }

  public get TimePoints(): number[] {
    return this.timePoints;
  }

  private buildCurve(powerValues: number[], label: string) {
    let prevValue = this.getMaxPowerForInterval(powerValues, 1);
    let prevTime = _.first(this.timePoints);
    const result = new Array<PowerCurvePoint>();
    this.timePoints.forEach(time => {
      const powerValue = this.getMaxPowerForInterval(powerValues, time);
      if (prevValue !== powerValue) {
        result.push({ time: prevTime, power: prevValue, label });
      }
      prevValue = powerValue;
      prevTime = time;
    });
    result.push({ time: prevTime, power: prevValue, label });
    return result;
  }

  private getMaxPowerForInterval(powerValues: number[], intervalLength: number): number {
    const avgs = utils.movingAverage(powerValues, intervalLength);
    return _.max(avgs);
  }

  private getDefaultTimePoints() {
    const logscale = 1.5;
    const fixedPoints = _.range(1, Math.min(20, this.timeLength + 1));
    const logPoints = generateLogScale(logscale, this.timeLength);
    return _.uniq([...fixedPoints, ...logPoints]).sort((n1, n2) => n1 - n2);
  }
}
