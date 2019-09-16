import _ from 'lodash'
import { movingAverage } from '../../common/movingAverage'

export const getTrainingStressBalance = (startingStress: number, weeklyStress: number[]) => {
  const av = startingStress / 7
  const data = _.flatMap([startingStress, ...weeklyStress], x => [x / 3, 0, x / 3, 0, x / 3, 0, 0])
  const mAvg = movingAverage(data, 7)
  console.log(mAvg.length, 'length')
  return _.map(mAvg, x => av - x)
}
