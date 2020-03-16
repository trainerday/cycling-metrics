import { map } from 'lodash'
import { WorkoutInterval } from '../../models/workoutInterval'
import { TimeTypes } from './types'

export const getWorkoutIntervalsFromSegments = (
  segments: [number, number, number][],
  segmentsTimeType: TimeTypes = TimeTypes.MINUTES,
): WorkoutInterval[] => {
  const workoutSegments: WorkoutInterval[] = map(
    segments,
    ([time, startPower, endPower]): WorkoutInterval =>
      new WorkoutInterval(segmentsTimeType === TimeTypes.MINUTES ? time * 60 : time, startPower, endPower),
  )
  return workoutSegments
}
