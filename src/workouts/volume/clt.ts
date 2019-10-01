import _ from 'lodash'

export const getCtlSingle = (tss: number, yesterdayCtl:number) => Math.round(((tss - yesterdayCtl) / 42 + yesterdayCtl)*10)/10

//todo add tests make sure elementsToAdd > 0, or shorten array?
const addZeroElementsToNumberArray = (arr: number[], elementsToAdd: number) => [...arr,..._.times(elementsToAdd, _.constant(0))]

//todo add tests
export const getCtlDays = (days: any, ctlIn: number) => {
  let ctl = ctlIn
  return _.map(days, tss => {ctl = getCtlSingle(tss,ctl); return ctl})
}

// this is main method for export
export const getCtl = (dailyTss: number[], ctlStart: number, dayCount: number, ) :number [] => {
  const allDays = addZeroElementsToNumberArray(dailyTss, dayCount - dailyTss.length)
  return getCtlDays(allDays, ctlStart)
}
