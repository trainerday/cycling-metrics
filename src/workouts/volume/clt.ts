import { WorkoutStats } from '../../models/workoutStats'



export const getCtl = (dailyTss: number[], ctl: number, days: number, ) :number [] => {
  const ctlArr = []

  const getTssIfExistsOrZero = (i: number, dailyTss: number[]) => (i < dailyTss.length)?dailyTss[i]:0
  const getYesterdaysCtl = (i: number, ctlArr:number[]) => (i > 0)? ctlArr[i - 1]:0
  const getCtl = (tss: number, yesterdayCtl:number) => (tss - yesterdayCtl) / 42 + yesterdayCtl

  for (let i = 0; i <= days; i++) {
    let yesterdayCtl = getYesterdaysCtl(i, ctlArr)
    ctl = getCtl(getTssIfExistsOrZero(i, dailyTss), yesterdayCtl)
    ctlArr.push(Math.round(ctl * 10) / 10)
  }

  return ctlArr
}

export const getCtlOld = (dailyTss: number[], days: number, startCtl: number) => {
  const out = []

  for (let i = 0; i <= days; i++) {
    let tss = 0
    if (i < dailyTss.length) {
      tss = dailyTss[i]
    }
    let ctl = startCtl
    let yesterdayCtl = 0
    if (i > 0) {
      yesterdayCtl = out[i - 1].ctl
    }
    ctl = (tss - yesterdayCtl) / 42 + yesterdayCtl
    const obj = new WorkoutStats()
    obj.day = i
    obj.ctl = Math.round(ctl * 10) / 10
    obj.tss = tss
    out.push(obj)
  }

  return out
}
