import * as _ from 'lodash/fp'
import { getCtl } from './clt'
import moment from 'moment'



test('test', () => {
  const getDate = (dayNum: number) => moment('2019-09-30T00:00:00.000Z').add(dayNum, 'days').toDate()
  const getObj = (dayNum: number, tss: number) => ({date: getDate(dayNum), tss: tss})
  const twoWeekArr = _.map((ele: number)=>getObj(ele,70),[0,2,4,7,9,11])
//  console.log(twoWeekArr)
  expect(twoWeekArr![0].tss).toBe(70)
})

test('test2', () => {
  const day = [100,0,100,0,100,0,0,100,0,100,0,100,0,0]
  const res = getCtl(day,0, 80)
  const max:number = _.max(res)!
  expect(max).toBe(12.4)
})




describe('TSS', () => {
  test('one day of 70tss should be 1.67 tss', () => {
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTss()
    const res = getCtl(dailyTss, startCtl, days)
    expect(res[0]).toBe(1.7)
  })

  test('21 days of 70tss should be 27.8 tss', () => {
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTss()
    const res = getCtl(dailyTss, startCtl, days)
    expect(res[20]).toBe(27.8)
  })

  test('21 days of 70tss should be 32 tss on day 31', () => {
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTss()
    const res = getCtl(dailyTss, startCtl, days)
    expect(res[30]).toBe(32)
  })

  function getDailyTss(): number[] {
    const dailyTss = []
    for (let i = 0; i <= 27; i++) {
      dailyTss.push(70)
    }
    return dailyTss
  }
})