export class PowerCurvePoint {
  public time: number = 0
  public power: number = 0
  public label: string
  public constructor(time: number, power: number, label: string) {
    this.time = time
    this.power = power
    this.label = label
  }
}
