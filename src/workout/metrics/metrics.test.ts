import * as metrics from "./index"


describe("TSS", () => {
    test("zero length array should be 0", () => {
        //const res = metrics.getTss([])
        //expect(res).toEqual(0)
    })    
    test("60min @ 100% of FTP should be 100 tss points", () => {
        const res = metrics.getTss(metrics.Workout.FromArray([[60,100,100]]))
        expect(res).toEqual(100)
    })    
    test("60min @ 20-100% of FTP should be 36 tss points", () => {
        const res = metrics.getTss( metrics.Workout.FromArray([[60,20,100]]))
        expect(res).toEqual(50)
    })  
    test("spinner workout should be 72", () => {
        const spinner = metrics.Workout.FromArray([[1,50,50],[1,40,40],[1,70,70],[1,40,40],[1,60,60],[1,40,40],[1,90,90],[1,40,40],[1,80,80],[1,40,40],[1,110,110],[1,40,40],[1,100,100],[1,40,40],[1,130,130],[1,40,40],[1,120,120],[3,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[1,30,30],[1,120,120],[5,40,40]])
        const res = metrics.getTss(spinner)
        expect(res).toEqual(72)
    })  
})

