import _ from 'lodash'

export const movingAverage = (values: (number)[], intervalLength: number): number[] => {
  const valuesArr = [...values]
  const results: number[] = []
  let sum: number = _.sum(_.take(valuesArr, intervalLength))

  results.push(sum / intervalLength)
  for (let i = intervalLength; i < valuesArr.length; i++) {
    if (valuesArr[i] && valuesArr) {
      sum += valuesArr[i]
      sum -= valuesArr[i - intervalLength]
    }
    results.push(sum / intervalLength)
  }
  return results
}
