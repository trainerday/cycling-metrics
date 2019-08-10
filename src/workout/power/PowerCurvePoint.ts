export const WithLabel = (point: PowerCurvePoint, label: string) => {
    return label === undefined 
           ? point
           : {
                label,
                power: point.power,
                time : point.time,
             };
}

export class PowerCurvePoint {
    public time: number;
    public label: string;
    public power: number;

}
