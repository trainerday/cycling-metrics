export class WorkoutInterval {
  public seconds: number = 0
  public startPower: number = 0
  public endPower: number = 0

  public constructor(seconds: number, startPower: number, endPower: number) {
    this.seconds = seconds
    this.startPower = startPower
    this.endPower = endPower
  }
}
