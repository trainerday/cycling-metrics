import _ from 'lodash';
import * as utils from '../common/utils'

class WorkoutInterval {
  Seconds: number;
  StartPower: number;
  EndPower: number;
}

export class Workout {
  // <start_second, end_second, segment> array
  private segments: Array<[number,number,WorkoutInterval]>;
  private length: number;

  constructor (segments: Array<WorkoutInterval>) {
    if (segments.length === 0)
      throw "Segments cannot be empty";
    var time = 0;
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

  public static FromArray(segements : Array<[number,number,number]>) {
    let workoutSegments = _.map(segements, ([Minutes,StartPower,EndPower]) => {return { Seconds: Minutes*60, StartPower, EndPower }})
    return new Workout(workoutSegments);
  }
}

export function getIntensityFactor2(workout: Workout){
  const FTP=100// we are not using power we are using percent of FTP.
  const {np:NP, seconds:seconds} = getNormalizedPower(workout)
  const IF = (NP/FTP)
  return {if:IF, seconds:seconds, np:NP}
}

export function getTss(workout:Workout){
  const FTP = 100// we are not using power we are using percent of FTP.
  const {if:IF, seconds:t, np:NP} = getIntensityFactor2(workout)
  return Math.round(((t * NP * IF) / (FTP * 3600)) * 100) 
}

function getIntensityFactorInt(workout: Workout){
  const if2 = getIntensityFactor2(workout).if
  return utils.floor2(if2)
}

function getNormalizedPower(workout: Workout){
  if (workout.Length() < 120) {
    return {np:0, seconds:0}
  }
  const mvAvg =  utils.movingAverage(x => workout.getValue(x), workout.Length(), 30)
  const avgPow4 = _.sumBy(mvAvg, x => utils.round2(Math.pow(x,4))) / mvAvg.length
  const avg = utils.round2(Math.pow(avgPow4,.25))
  return {np:avg, seconds:workout.Length()} 
}
