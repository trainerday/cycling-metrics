import * as _ from 'lodash/fp'
import { getCtl, getCtlSingle } from './clt'
import moment from 'moment'

describe('getCtlSingle - 100', () => {
  test('getCtlSingle', () => {
    const res = getCtlSingle(100,0)
    expect(res).toBe(2.4)
  })
  test('getCtlSingle - 100-d2', () => {
    const res = getCtlSingle(100,2.4)
    expect(res).toBe(4.7)
  })
  test('getCtlSingle - 70', () => {
    const res = getCtlSingle(70,0)
    expect(res).toBe(1.7)
  })
})


describe('Ctl', () => {
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
    expect(res[20]).toBe(9.9)
  })

  test('test2', () => {
    const day = [70,0,70,0,70,0,0,130,0,130,0,130,0,0]
    const res = getCtl(day,0, 80)
    const max:number = _.max(res)!
    expect(max).toBe(13)
    expect(res[20]).toBe(10.3)
  })
})


describe('TSS', () => {
  test('21 days of 70tss should be 27.8 tss', () => {
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTssForTests()
    const res = getCtl(dailyTss, startCtl, days)
    expect(res[20]).toBe(27.8)
    expect(res.length).toBe(days)

  })

  test('21 days of 70tss should be 32 tss on day 31', () => {
    const days = 30
    const startCtl = 0
    const dailyTss = getDailyTssForTests()
    const res = getCtl(dailyTss, startCtl, days)
    console.log(res.length)
    expect(res[29]).toBe(32.8)
  })

  function getDailyTssForTests(): number[] {
    const dailyTss = []
    for (let i = 0; i <= 27; i++) {
      dailyTss.push(70)
    }
    return dailyTss
  }
})
