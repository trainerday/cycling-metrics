import _ from 'lodash'
import { WorkoutInterval } from '../models/workoutInterval'

export class Workout {
  // <start_second, end_second, segment> array
  private readonly segments: [number, number, WorkoutInterval][]
  private readonly length: number

  public static FromArray(segments: [number, number, number][]) {
    const workoutSegments = _.map(segments, ([Minutes, StartPower, EndPower]) => ({
      Seconds: Minutes * 60,
      StartPower,
      EndPower,
    }))
    return new Workout(workoutSegments)
  }


  constructor(segments: WorkoutInterval[]) {
    if (segments.length === 0) {
      throw new Error('Segments cannot be empty')
    }
    let time = 0
    this.segments = Array<[number, number, WorkoutInterval]>()
    _.forEach(segments, s => {
      this.segments.push([time, time + s.Seconds, s])
      time = time + s.Seconds
    })
    this.length = time
  }


  public Length = () => this.length

  public getSegments(): any[] {
    const segmentsOut = []
    for (const segment of this.segments) {
      const seconds:number = segment[0] * 60
      const startPower:number = segment[1]
      const endPower2:number = segment[2]

      for (let i = 0; i < seconds; i++) {
        segmentsOut.push(startPower + (i / seconds) * (endPower2 - startPower))
      }
    }
    return segmentsOut
  }
}
