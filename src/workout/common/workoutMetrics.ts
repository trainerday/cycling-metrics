import _ from 'lodash';
import { MetricsPoint } from './metricsPoint';

export class WorkoutMetrics implements Iterable<number> {
  private cycleMetrics: MetricsPoint[];

  constructor(cycleMetrics: MetricsPoint[]) {
    const continousTime = this.interpolateMissingTimePoints(cycleMetrics);
    this.interpolateMissingPowerValues(continousTime);
    this.cycleMetrics = continousTime;
  }

  public [Symbol.iterator]() {
    return _.map(this.cycleMetrics, x => x.power)[Symbol.iterator]();
  }

  private interpolateMissingPowerValues(cycleMetrics: MetricsPoint[]): void {
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
      if (cycleMetrics[i].power === undefined) {
        const lidx = i - 1;
        let ridx = i + 1;
        while (cycleMetrics[ridx].power === undefined) {
          ridx++;
        }
        const lvalue = cycleMetrics[lidx].power;
        const rvalue = cycleMetrics[ridx].power;
        cycleMetrics[i].power = lvalue + (rvalue - lvalue) / (ridx - lidx);
      }
    }
  }

  private interpolateMissingTimePoints(cycleMetrics: MetricsPoint[]): MetricsPoint[] {
    const maxTime = _.maxBy(cycleMetrics, m => m.time).time;
    const metricsLookup = _.keyBy(cycleMetrics, m => m.time);

    const result = new Array<MetricsPoint>();
    for (let i = 0; i <= maxTime; i++) {
      if (metricsLookup[i] !== undefined) {
        result.push(metricsLookup[i]);
      } else {
        result.push(new MetricsPoint(i, undefined, undefined));
      }
    }
    return result;
  }
}
