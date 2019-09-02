import _ from 'lodash';

export class Workout implements Iterable<number> {
  public static FromArray(segements: Array<[number, number, number]>) {
    const workoutSegments = _.map(segements, ([Minutes, StartPower, EndPower]) => ({
      Seconds: Minutes * 60,
      StartPower,
      EndPower
    }));
    return new Workout(workoutSegments);
  }

  // <start_second, end_second, segment> array
  private segments: Array<[number, number, WorkoutInterval]>;
  private length: number;

  constructor(segments: WorkoutInterval[]) {
    if (segments.length === 0) {
      throw new Error('Segments cannot be empty');
    }
    let time = 0;
    this.segments = Array<[number, number, WorkoutInterval]>();
    _.forEach(segments, s => {
      this.segments.push([time, time + s.Seconds, s]);
      time = time + s.Seconds;
    });
    this.length = time;
  }

  public getValue(second: number) {
    const [start, end, segment] = _.first(_.dropWhile(this.segments, s => s[1] <= second));
    return segment.StartPower + ((second - start) * (segment.EndPower - segment.StartPower)) / segment.Seconds;
  }

  public Length = () => this.length;

  public [Symbol.iterator] = function*() {
    for (const [start, end, interval] of this.segments) {
      for (let i = 0; i < interval.Seconds; i++) {
        yield interval.StartPower + (i / interval.Seconds) * (interval.EndPower - interval.StartPower);
      }
    }
  };
}
