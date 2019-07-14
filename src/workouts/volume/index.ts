import {WorkoutStats} from '../common/WorkoutStats'

export const getCtl = (dailyTss:number[], days:number, startCtl:number) => {
    const out = []

    for (let i = 0; i <= days; i++) {
        let tss = 0
        if (i < dailyTss.length) {tss = dailyTss[i]}
        let ctl = startCtl
        let yesterdayCtl = 0
        if (i > 0) {yesterdayCtl = out[i-1].ctl}
        ctl = (tss - yesterdayCtl) / 42 + yesterdayCtl
        const obj = new WorkoutStats()
        obj.day = i
        obj.ctl = Math.round(ctl * 10)/10
        obj.tss = tss
        out.push(obj)
    }
    
    return out
}

