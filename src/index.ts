import * as common from "./workout/common/metricsPoint"
import * as metrics from "./workout/converter/index"
import * as power from "./workout/power/index"
import {WorkoutStats} from "./workouts/common/workoutStats"
import * as volume from "./workouts/volume/index"

export const convertStravaToCyclingMetrics = metrics.convertStravaToCyclingMetrics
export const MeanMaxPower = power.MeanMaxPower
export const getCtl = volume.getCtl
export const Workout = WorkoutStats
export const MetricsPoint = common.MetricsPoint