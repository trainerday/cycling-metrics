import _ from 'lodash';

export const movingAverage = (values: Iterable<number>, intervalLength: number)  => {
    const valuesArr = [...values];
    const results = [];
    let sum = _.sumBy(_.range(0,intervalLength), t => valuesArr[t]);
    results.push(sum / intervalLength);
    for(let i = intervalLength; i < valuesArr.length; i++){
        sum += valuesArr[i];
        sum -= valuesArr[i-intervalLength];
        results.push(sum / intervalLength);
    };
    return results;
}

export const round2 = (x: number) => Math.round(x*100)/100;

export const floor2 = (x: number) => Math.floor(x*100)/100;
