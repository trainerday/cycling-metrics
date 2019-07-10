import moment = require('moment');
import {WorkoutStats} from '../common/workoutStats'
import * as volume from './index'

test('one day of 70tss should be 1.67 tss', () => {
    const startDate = new Date(Date.parse('2019-10-07T00:00:00+0000'))
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTss()

    const res = volume.getCtl(dailyTss,startDate,days,startCtl)
    expect(Math.round(res[0].ctl*100)/100).toBe(1.67)
})

test('21 days of 70tss should be 27.8 tss', () => {
    const theDate = new Date(Date.parse('2019-10-07T00:00:00+0000'))
    const startDate = new Date(Date.parse('2019-10-07T00:00:00+0000'))
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTss()

    const res = volume.getCtl(dailyTss,startDate,days,startCtl)
    expect(Math.round(res[20].ctl*100)/100).toBe(27.8)
})

test('21 days of 70tss should be 32 tss on day 31', () => {
    const theDate = new Date(Date.parse('2019-10-07T00:00:00+0000'))
    const startDate = new Date(Date.parse('2019-10-07T00:00:00+0000'))
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTss()

    const res = volume.getCtl(dailyTss,startDate,days,startCtl)
    expect(Math.round(res[30].ctl)).toBe(32)
})

function getDailyTss(){
    const theDate = new Date(Date.parse('2019-10-07T00:00:00+0000'))
    const dailyTss = []
    for (const i = 0; i <= 27; i++) {
        const woStats = new WorkoutStats()
        woStats.date = theDate
        woStats.tss = 70
        dailyTss.push (woStats)
        theDate = moment(theDate).add(1, 'days').toDate()
    }
    return dailyTss
}