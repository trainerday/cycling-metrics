import { map } from 'lodash'
import { WorkoutInterval } from '../../models/workoutInterval'
import { Workout } from '../../common/workout'


export const getWorkoutFromSegments = (segments: [number, number, number][]): Workout => {
  const workoutSegments: WorkoutInterval[] = map(
    segments,
    ([minutes, startPower, endPower]): WorkoutInterval => new WorkoutInterval(minutes * 60, startPower, endPower),
  )
  return new Workout(workoutSegments)
}