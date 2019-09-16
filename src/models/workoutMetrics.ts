import { MetricsPoint } from './metricsPoint'
import { interpolateMissingPowerValues, interpolateMissingTimePoints } from '../workout/converter/workoutMetricsHelper'

export class WorkoutMetrics {
  public cycleMetrics: MetricsPoint[]

  public constructor(cycleMetrics: MetricsPoint[]) {
    const continuousTime = interpolateMissingTimePoints(cycleMetrics)
    interpolateMissingPowerValues(continuousTime)
    this.cycleMetrics = continuousTime
  }
}
