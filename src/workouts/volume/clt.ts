import _ from 'lodash'

export const getSingleDayCtl = (tss: number, yesterdayCtl:number) => Math.round(((tss - yesterdayCtl) / 42 + yesterdayCtl)*10)/10
export const addZeroElementsToNumberArray = (arr: number[], elementsToAdd: number) => [...arr,..._.times(elementsToAdd, _.constant(0))]

export const getCtl = (dailyTss: number[], ctlStart: number, dayCount: number, ) :number [] => {
  const getCtlDays = (days: any, ctlIn: number) => {
    let ctl = ctlIn
    return _.map(days, tss => {ctl = getSingleDayCtl(tss,ctl); return ctl})
  }

  const daysToAdd = dayCount < dailyTss.length ? 0 : dayCount - dailyTss.length
  const allDays = addZeroElementsToNumberArray(dailyTss, daysToAdd)
  return getCtlDays(allDays, ctlStart)
}
