import _ from 'lodash';

class WorkoutInterval {
  Seconds: number;
  StartPower: number;
  EndPower: number;
}

export class Workout {
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
  
  private getValue(second:number) {
    const [start, end, segment] = _.first(_.dropWhile(this.segments, s => s[1] <= second))
    return segment.StartPower + (second - start) * (segment.EndPower - segment.StartPower) / segment.Seconds;
  }

  public Length = () => this.length; 

  public static FromArray(segements : Array<[number,number,number]>) {
    let workoutSegments = _.map(segements, ([Minutes,StartPower,EndPower]) => {return { Seconds: Minutes*60, StartPower, EndPower }})
    return new Workout(workoutSegments);
  }

  public MovingAverage(intervalLength: number) {
    var results = Array<number>();
    var sum = _.sumBy(_.range(0,intervalLength), t => this.getValue(t));
    results.push(sum / intervalLength);
    for(var i = intervalLength+1; i < this.length; i++){
      sum += this.getValue(i);
      sum -= this.getValue(i-intervalLength-1);
     results.push(sum / intervalLength);
    };
    return results;
  }
}

export function getIntensityFactor2(workout: Workout){
  const FTP=100// we are not using power we are using percent of FTP.
  const np = getNormalizedPower(workout)
  const NP = np.np
  const IF = (NP/FTP)
  const out = {if:IF,seconds:np.seconds,np:NP}
//  console.log(out)
  return out
}

export function getTss(workout:Workout){
  const FTP = 100// we are not using power we are using percent of FTP.
  debugger;
  const ifObj = getIntensityFactor2(workout)
  console.log(ifObj)
  const IF = ifObj.if
  const NP = ifObj.np
  const t = ifObj.seconds
  const TSS = Math.round(((t * NP * IF) / (FTP * 3600)) * 100) 
  return TSS
}

function getIntensityFactorInt(workout: Workout){
  const if2= getIntensityFactor2(workout).if
  return Math.floor(if2 * 100)/100
}

function getNormalizedPower(workout: Workout){
  if (workout.Length() < 120) {
    return {np:0, seconds:0}
  }
  const mvAvg = workout.MovingAverage(30)
  const avgPow4 = _.sumBy(mvAvg, x => Math.round(Math.pow(x,4)*100)/100) / mvAvg.length
  const avg = Math.round(Math.pow(avgPow4,.25)*100)/100
  return {np:avg, seconds:workout.Length()} 
}
