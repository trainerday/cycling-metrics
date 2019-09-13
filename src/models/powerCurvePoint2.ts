export class PowerCurvePoint2 {
  public time?: number = 0
  public power?: number = 0
  public label?: string
  constructor (time: number, power?: number, label?: string){
    this.time = time
    this.power = power
    this.label = label
  }
}