import * as metrics from "./index"


describe("TSS", () => {
    test("zero length array should be 0", () => {
       const res = metrics.getTss([])
        expect(res).toEqual(0)
    })    
    test("60min @ 100% of FTP should be 100 tss points", () => {
       const res = metrics.getTss([[60,100,100]])
        expect(res).toEqual(100)
    })    
    test("60min @ 20-100% of FTP should be 36 tss points", () => {
       const res = metrics.getTss([[60,20,100]])
        expect(res).toEqual(36)
    })  
})

