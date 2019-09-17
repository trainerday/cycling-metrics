import { WorkoutStats } from '../../models/workoutStats'
import _ from 'lodash'


export const getCtl = (dailyTss: number[], ctl: number, days: number, ) :number [] => {
  const getTssIfExistsOrZero = (dailyTss: number) => dailyTss?dailyTss:0
  const getCtl = (tss: number, yesterdayCtl:number) => Math.round(((tss - yesterdayCtl) / 42 + yesterdayCtl)*10)/10
  const dayArr = _.range(days+1)
  const dayArr1 = _.map(dayArr, (day: number,index: number) => ({day: day, tss:dailyTss[index]}))
  dayArr1.forEach((day: any) => {
    ctl = getCtl(getTssIfExistsOrZero(day.tss), ctl)
    day.ctl = ctl
  })
  return _.map(dayArr1, 'ctl')
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
