import _ from 'lodash';

export const movingAverage = (values: Iterable<number>, intervalLength: number)  => {
    const valuesArr = [...values];
    const results = [];
    let sum = _.sum(_.take(valuesArr, intervalLength));
    results.push(sum / intervalLength);
    for(let i = intervalLength; i < valuesArr.length; i++){
        sum += valuesArr[i];
        sum -= valuesArr[i-intervalLength];
        results.push(sum / intervalLength);
    };
    return results;
}