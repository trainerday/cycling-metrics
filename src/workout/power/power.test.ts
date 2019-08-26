/// <reference types="jest" />
import {writeFile} from "fs"
import {drop, range} from 'lodash'
import {WorkoutMetrics} from "../common/index"
import {MetricsPoint} from "../common/metricsPoint"
import {convertStravaToWorkoutMetrics} from "../converter/index"
import data2 from './bike3.json';
import {generateLogScale, MeanMaxPower} from "./index"
import data from './sampleResponseStream.json'

  describe("Power duration curve", () => {
    test("should decrease linearly for linear power2", () => {
        const power = [120,140,160];
        expect(new MeanMaxPower(power).Curve)
        .toEqual([160,150,140]);
    });

    test("should decrease linearly for linear power", () => {
        const power = [120,118,116,114,112,110,108,106,104,102,100];
        expect(new MeanMaxPower(power).Curve)
        .toEqual([120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("should be const for const power", () => {
        const power = [110,110,110,110,110,110,110,110,110,110,110];
        expect(new MeanMaxPower(power).Curve)
        .toEqual([110,110,110,110,110,110,110,110,110,110,110]);
    });

    test("should descrease gradually for bell-like power spike", () => {
        const power = [102,106,110,114,118,120,116,112,108,104,100];
        expect(new MeanMaxPower(power).Curve)
        .toEqual([120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("should interpolate undefined power value lineary", () => {
        const time = [0,1,2,3,4,5,6,7,8,9,10];
        const power = [120,118,116,undefined,112,undefined,undefined,106,104,undefined,100];
        const metrics = convertStravaToWorkoutMetrics(time, power, null);
        expect(new MeanMaxPower([...metrics]).Curve)
        .toEqual([120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("should extrapolate boundary to const", () => {
        const time = [0,1,2];
        const power = [undefined, 120, undefined];
        const metrics = convertStravaToWorkoutMetrics(time, power, null);
        expect(new MeanMaxPower([...metrics]).Curve)
        .toEqual([120,120,120]);
    });

    test("should interpolate missing Metrics points lineary", () => {
        const time = [0,10];
        const power = [120,100];
        const metrics = convertStravaToWorkoutMetrics(time, power, null);
        expect(new MeanMaxPower([...metrics]).Curve)
        .toEqual([120,119,118,117,116,115,114,113,112,111,110]);
    });

    test("sample response stream", () => {
        const time = data.filter( x => x.type === 'time')[0].data as number[];
        const hr = data.filter( x => x.type === 'heartrate')[0].data as number[];
        const power = data.filter( x => x.type === 'watts')[0].data as number[];
        const metrics = convertStravaToWorkoutMetrics(time, power, hr);
        
        const curve = new MeanMaxPower([...metrics])
        const powerCurve = drop (curve.Curve, 1);
        const points = drop (curve.TimePoints, 1);

        const min = Math.min.apply(null, power);
        const max = Math.max.apply(null, power);

        // console.log(powerCurve.length);
        // writeFile("logcurve.json", JSON.stringify(powerCurve), x => {} );
        // writeFile("logcurveTime.json", JSON.stringify(points), x => {} );
        powerCurve.forEach(pwr => {
            expect(pwr).toBeLessThanOrEqual(max);
            expect(pwr).toBeGreaterThanOrEqual(min);
        });
    });

    test.skip("sample response stream 2", () => {
        const metrics = new WorkoutMetrics(data2.points.map(x => new MetricsPoint(x.second, parseInt(x.watts, 10), 0)));
  
        const points = new Array<number>();
        let current = 1;
        while (current < 30*60) {
            points.push(Math.floor(current));
            current = current * 1.5;
        }

        const curve = new MeanMaxPower([...metrics], points)
        const powerCurve = drop (curve.Curve, 1);

        writeFile("logcurve2.json", JSON.stringify(powerCurve), x => undefined );
        writeFile("logcurveTime2.json", JSON.stringify(points), x => undefined );
    });
  });

  describe("Power curve intervals", () => {
    test("should return values between interval", () => {
        const power = [120,118,116,114,112,110,108,106,104,102,100];
        expect(new MeanMaxPower(power, range(1, power.length, 4)).Curve)
        .toEqual([120,116,112]);
    });

    test("should return values in log scale", () => {
        const power = [120,118,116,114,112,110,108,106,104,102,100];
        expect(new MeanMaxPower(power, generateLogScale(2,power.length)).Curve)
        .toEqual([120,119,117,113]);
    });
  });

  describe("Power Average", () => {
    test("should be average power", () => {
        const power = [110,110,110,110,110,120,120,120,120,120];
        const pdCurve = new MeanMaxPower(power).Curve;
        expect(pdCurve[0]).toEqual(120);
        expect(pdCurve[1]).toEqual(120);
        expect(pdCurve[3]).toEqual(120);
        expect(pdCurve[9]).toEqual(115);
   });
  });

  describe("Power curve merge", () => {
    const time = [0,1,2,3,4,5,6,7,8,9];
    const power1 = [130,130,130,130,130,120,120,120,120,120];
    const power2 = [160,150,140,130,120,110,100,100,100,100];
    const power3 = [125.1,125.1,125.1,125.1,125.1,125.1,125.1,125.10,125.1,125.1];
    const curve1 = new MeanMaxPower(power1, undefined, "training1");
    const curve2 = new MeanMaxPower(power2, undefined, "training2");
    const curve3 = new MeanMaxPower(power3, undefined, "training3");
 
    test("gets max for each time point", () => {
        const mergeCurve = MeanMaxPower.Merge(curve1,curve2);

        expect(mergeCurve.get(1).power).toEqual(160);
        expect(mergeCurve.get(2).power).toEqual(155);
        expect(mergeCurve.get(4).power).toEqual(145);
        expect(mergeCurve.get(10).power).toEqual(125);
        expect(mergeCurve.TimePoints).toEqual(curve1.TimePoints);
        expect(mergeCurve.TimePoints).toEqual(curve2.TimePoints);
    })

    test("label segments according to source", () => {
        const mergeCurve = MeanMaxPower.Merge(curve1,curve2);

        expect(mergeCurve.get(1).label).toEqual("training2");
        expect(mergeCurve.get(2).label).toEqual("training2");
        expect(mergeCurve.get(4).label).toEqual("training2");
        expect(mergeCurve.get(10).label).toEqual("training1");
    })

    test("label can be overriden when merged", () => {
        const mergeCurve = MeanMaxPower.Merge(curve1, curve2, "curve1", "curve2");

        expect(mergeCurve.get(1).label).toEqual("curve2");
        expect(mergeCurve.get(2).label).toEqual("curve2");
        expect(mergeCurve.get(4).label).toEqual("curve2");
        expect(mergeCurve.get(10).label).toEqual("curve1");
    })

    test("can merge array of powerCurves", () => {
        const mergeCurve = MeanMaxPower.MergeAll([curve1, curve2, curve3]);

        expect(mergeCurve.get(1).label).toEqual("training2");
        expect(mergeCurve.get(9).label).toEqual("training1");
        expect(mergeCurve.get(10).label).toEqual("training3");
    })

    test("can override label while merging array", () => {
        const mergeCurve = MeanMaxPower.MergeAll([curve1, curve2, curve3], "last week");

        expect(mergeCurve.get(1).label).toEqual("last week");
        expect(mergeCurve.get(9).label).toEqual("last week");
        expect(mergeCurve.get(10).label).toEqual("last week");
    })
  });


