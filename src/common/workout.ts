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
  public static fromArray(segments: [number, number, number][]): Workout {
    const workoutSegments: WorkoutInterval[] = _.map(
      segments,
      ([minutes, startPower, endPower]): WorkoutInterval => new WorkoutInterval(minutes * 60, startPower, endPower),
    )
    return new Workout(workoutSegments)
  }

  public length = (): number => this._length

  public getSegments(): number[] {
    const segmentsOut = []
    for (const segment of this.segments) {
      const seconds: number = segment[0] * 60
      const startPower: number = segment[1]
      const endPower: WorkoutInterval = segment[2]

      for (let i = 0; i < seconds; i++) {
        segmentsOut.push(startPower + (i / seconds) * (endPower.seconds - startPower))
      }
    }
    return segmentsOut
  }
}
