import * as metrics from "./workout/converter/index"
import * as power from "./workout/power/index"
import * as common from "./workout/common/metricsPoint"
import {WorkoutStats} from "./workouts/common/workoutStats"
import * as volume from "./workouts/volume/index"

export const convertStravaToCyclingMetrics = metrics.convertStravaToCyclingMetrics
export const getMeanMaxPower = power.getMeanMaxPower
export const getCtl = volume.getCtl
export const Workout = WorkoutStats
export const MetricsPoint = common.MetricsPoint