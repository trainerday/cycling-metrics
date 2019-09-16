import _ from 'lodash'
import { WorkoutInterval } from '../models/workoutInterval'

export class Workout {
  // <start_second, end_second, segment> array
  private readonly segments: [number, number, WorkoutInterval][]
  private readonly _length: number

  public constructor(segments: WorkoutInterval[]) {
    if (segments.length === 0) {
      throw new Error('Segments cannot be empty')
    }
    let time = 0
    this.segments = Array<[number, number, WorkoutInterval]>()
    segments.forEach((s: WorkoutInterval): void => {
      this.segments.push([time, time + s.seconds, s])
      time = time + s.seconds
    })
    this._length = time
  }

  public length = (): number => this._length

  public getSegments(): number[] {
    const segmentsOut = []
    for (let [, , interval] of this.segments) {
      for (let i = 0; i < interval.seconds; i++) {
        segmentsOut.push(interval.startPower + (i / interval.seconds) * (interval.endPower - interval.startPower))
      }
    }
    return segmentsOut
  }
}
