import _ from 'lodash';

export const movingAverage = (getValue, length, intervalLength: number)  => {
    var results = Array<number>();
    var sum = _.sumBy(_.range(0,intervalLength), t => getValue(t));
    results.push(sum / intervalLength);
    for(var i = intervalLength; i < length; i++){
        sum += getValue(i);
        sum -= getValue(i-intervalLength);
        results.push(sum / intervalLength);
    };
    return results;
}

export const round2 = (x: number) => Math.round(x*100)/100;

export const floor2 = (x: number) => Math.floor(x*100)/100;
