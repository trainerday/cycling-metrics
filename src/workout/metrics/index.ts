import _ from 'lodash';
import * as utils from '../common/utils'

class WorkoutInterval {
  public Seconds: number;
  public StartPower: number;
  public EndPower: number;
}

export class Workout implements Iterable<number> {
  public static FromArray(segements : Array<[number,number,number]>) {
    const workoutSegments = _.map(segements, ([Minutes,StartPower,EndPower]) => ({ Seconds: Minutes*60, StartPower, EndPower }))
    return new Workout(workoutSegments);
  }

  // <start_second, end_second, segment> array
  private segments: Array<[number,number,WorkoutInterval]>;
  private length: number;

  public iterateValues = function* () {
    for (let [start,end, interval] of this.segments) {
      for(let i=0; i < interval.Seconds; i++){
        yield interval.StartPower + (i / interval.Seconds) * (interval.EndPower-interval.StartPower);
      }
    }
  }

  constructor (segments: WorkoutInterval[]) {
    if (segments.length === 0){
      throw new Error("Segments cannot be empty");
    }
    let time = 0;
    this.segments = Array<[number,number,WorkoutInterval]>();
    _.forEach(segments, s => {
      this.segments.push ([time, time + s.Seconds, s]);
      time = time + s.Seconds;
    })
    this.length = time;
  }
  
  public getValue(second:number) {
    const [start, end, segment] = _.first(_.dropWhile(this.segments, s => s[1] <= second))
    return segment.StartPower + (second - start) * (segment.EndPower - segment.StartPower) / segment.Seconds;
  }

  public Length = () => this.length; 

  [Symbol.iterator]() {
    return this.iterateValues()
  }
}

export function getIntensityFactor2(workout: Workout){
  const FTP=100// we are not using power we are using percent of FTP.
  const {np:NP, seconds:seconds} = getNormalizedPower(workout)
  const IF = (NP/FTP)
  return {if:IF, seconds, np:NP}
}

export function getTss(workout:Workout){
  const FTP = 100// we are not using power we are using percent of FTP.
  const {if:IF, seconds:t, np:NP} = getIntensityFactor2(workout)
  return _.round(((t * NP * IF) / (FTP * 3600)) * 100)
}

function getIntensityFactorInt(workout: Workout){
  const if2 = getIntensityFactor2(workout).if
  return _.floor(if2,2)
}

function getNormalizedPower(workout: Workout){
  if (workout.Length() < 120) {
    return {np:0, seconds:0}
  }
  workout[Symbol.iterator] = workout.iterateValues;
  const mvAvg =  utils.movingAverage(workout, 30)
  const avgPow4 = _.sumBy(mvAvg, x => _.round(Math.pow(x,4),2)) / mvAvg.length
  const avg = _.round(Math.pow(avgPow4,.25),2)
  return {np:avg, seconds:workout.Length()} 
}
