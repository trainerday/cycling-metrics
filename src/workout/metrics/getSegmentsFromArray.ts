import { WorkoutInterval } from '../../models/workoutInterval'

export const getSegmentsFromArray = (segments: [number, number, WorkoutInterval][]): number[] => {
  const segmentsOut = []
  for (let [, , interval] of segments) {
    for (let i = 0; i < interval.seconds; i++) {
      segmentsOut.push(interval.startPower + (i / interval.seconds) * (interval.endPower - interval.startPower))
    }
  }
  return segmentsOut
}
