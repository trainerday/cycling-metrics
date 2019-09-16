import { map } from 'lodash'
import { WorkoutInterval } from '../../models/workoutInterval'
import { Workout } from '../../models/workout'

export const getWorkoutIntervalsFromSegments = (segments: [number, number, number][]): WorkoutInterval[] => {
  const workoutSegments: WorkoutInterval[] = map(
    segments,
    ([minutes, startPower, endPower]): WorkoutInterval => new WorkoutInterval(minutes * 60, startPower, endPower),
  )
  return workoutSegments
}
