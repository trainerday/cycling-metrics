import { WorkoutInterval } from './workoutInterval'

export class Workout {
  // <start_second, end_second, segment> array
  public readonly segments: [number, number, WorkoutInterval][]
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
}
