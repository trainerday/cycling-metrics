import * as _ from 'lodash'
import moment = require('moment');
import {WorkoutStats} from '../common/WorkoutStats'

export const getCtl = (dailyTss:WorkoutStats[], startDate:Date, days:number, startCtl:number) => {
    const out = []
    const start = moment(startDate)
    let theDate = start.toDate()

    for (let i = 0; i <= days; i++) {
        const tssDay = _.filter(dailyTss, day => moment(day.date).diff(theDate, 'days') === 0)

        let tss = 0
        if (tssDay.length > 0){
            tss = tssDay[0].tss
        }

        let ctl = startCtl
        let yesterdayCtl = 0
        if (i > 0) {yesterdayCtl = out[i-1].ctl}
        ctl = (tss - yesterdayCtl) / 42 + yesterdayCtl

        const obj = new WorkoutStats()
        obj.date = theDate
        obj.day = i
        obj.ctl = ctl
        obj.tss = tss
        out.push(obj)
        theDate = moment(theDate).add(1, 'days').toDate()
    }
//  console.log(out)
    return out
}

