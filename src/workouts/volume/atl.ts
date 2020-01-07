import _ from 'lodash'

export const convertWeeksToDays = (weeklyStress: number[]) => {
  return _.flatMap(weeklyStress, x => [x / 7,x / 7,x / 7,x / 7,x / 7,x / 7,x / 7,x / 7])
}

export const getAtl = (startingAtl: number, dailyStress: number[]) => {
  const atl_const=7
  let yesterdayAtl = startingAtl
  let i=0
  return _.map(dailyStress, todayTss => {
    const atl = Math.round((todayTss*(1-Math.exp(-1/atl_const)) + yesterdayAtl*Math.exp(-1/atl_const)) * 10) / 10
    yesterdayAtl = atl
    return atl
  })
}
