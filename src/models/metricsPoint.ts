export class MetricsPoint {
  public time: number
  public power: number
  public heartRate?: number
  //private _meanMaxPower: number = 0

  public constructor(time: number, power: number, heartRate?: number) {
    this.time = time
    this.power = power
    this.heartRate = heartRate
  }
}
