import _ from 'lodash'
import * as utils from '../../common/utils'

export const getTrainingStressBalance = (startingStress: number, weeklyStress: number[]) => {
  const av = startingStress / 7
  const data = _.flatMap([startingStress, ...weeklyStress], x => [x / 3, 0, x / 3, 0, x / 3, 0, 0])
  return _.map(utils.movingAverage(data, 7), x => av - x)
}
