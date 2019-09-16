import { WorkoutInterval } from '../../models/workoutInterval'

export const getSegmentsFromArray = (segments: WorkoutInterval[]): number[] => {
  const segmentsOut:number[] = []

  segments.forEach(interval =>{
    for (let i = 0; i < interval.seconds; i++) {
      segmentsOut.push(interval.startPower + (i / interval.seconds) * (interval.endPower - interval.startPower))
    }
  })
  return segmentsOut
}
