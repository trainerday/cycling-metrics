import * as _ from 'lodash/fp'
import { getCtl, getSingleDayCtl, addZeroElementsToNumberArray } from './clt'
import moment from 'moment'

describe('getSingleDayCtl', () => {
  test('getSingleDayCtl - 100', () => {
    const res = getSingleDayCtl(100,0)
    expect(res).toBe(2.4)
  })
  test('getSingleDayCtl - 100-d2', () => {
    const res = getSingleDayCtl(100,2.4)
    expect(res).toBe(4.7)
  })
  test('getSingleDayCtl - 70', () => {
    const res = getSingleDayCtl(70,0)
    expect(res).toBe(1.7)
  })
  test('getSingleDayCtl - 0', () => {
    const res = getSingleDayCtl(0,50)
    expect(res).toBe(48.8)
  })
})

describe('addZeroElementsToNumberArray', () => {
  test('test 0-1', () => {
    const res = addZeroElementsToNumberArray([],1)
    expect(res.length).toBe(1)
  })
  test('test 3-2', () => {
    const res = addZeroElementsToNumberArray([1,2,3],2)
    expect(res.length).toBe(5)
  })
})



describe('Ctl', () => {
  test('test', () => {
    const getDate = (dayNum: number) => moment('2019-09-30T00:00:00.000Z').add(dayNum, 'days').toDate()
    const getObj = (dayNum: number, tss: number) => ({date: getDate(dayNum), tss: tss})
    const twoWeekArr = _.map((ele: number)=>getObj(ele,70),[0,2,4,7,9,11])
    expect(twoWeekArr![0].tss).toBe(70)
  })

  test('test2', () => {
    const day = [100,0,100,0,100,0,0,100,0,100,0,100,0,0]
    const res = getCtl(day,0, 80)
    const max:number = _.max(res)!
    expect(max).toBe(12.4)
    expect(res[20]).toBe(9.9)
  })

  test('test3', () => {
    const day = [70,0,70,0,70,0,0,130,0,130,0,130,0,0]
    const res = getCtl(day,0, 80)
    const max:number = _.max(res)!
    expect(max).toBe(13)
    expect(res[20]).toBe(10.3)
  })

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
