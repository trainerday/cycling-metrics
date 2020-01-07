import _ from 'lodash'

export const getTrainingStressBalance = (initialCtl: number, initialAtl: number, dailyCtl: number[], dailyAtl: number[]) => {
  const tsb = [Math.round((initialCtl - initialAtl) * 10) /10]
  let i = 0
  dailyCtl.forEach(ctl => {
    const atl = dailyAtl[i]
    tsb.push(Math.round((ctl - atl) * 10) / 10)
    i++
  })
  return tsb
}
