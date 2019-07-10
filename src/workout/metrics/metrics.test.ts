import * as metrics from "./index"


describe("Strava to Cycling Metrics converter", () => {
    test("smoke test", () => {
       const res = metrics.getTss([])
        expect(res).toEqual(0)
    })    
})

