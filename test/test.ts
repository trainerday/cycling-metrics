import { suite, test, slow, timeout } from "mocha-typescript";
import { assert } from "chai";
import {StravaToCyclingMetricsConverter} from "../src/index";
import { first } from 'lodash';
import data from './sampleResponseStream.json';

@suite(timeout(3000), slow(1000))
class StravaToCyclingMetricsConverterSuite {
    
    @test smokeTest() {
        var seconds = [1,2,3,4];
        var power = [110,120,130,140];
        var hr = [90,92,93,94];

        var results = StravaToCyclingMetricsConverter(seconds, power, hr);
        assert.deepEqual(results, [[1,110,90], [2,120,92],[3,130,93], [4,140,94]], "result incorrect");
    }

    @test differentLengthShouldThrow() {
        var seconds = [1,2];
        var power = [110];
        var hr = [90,92,93];
        
        assert.throws(() => StravaToCyclingMetricsConverter(seconds, power, hr));
    }

    @test assertSampleResponseStream() {
        const dat: any[] = data;
        
        const time = dat.filter( x => x.type === 'time')[0];
        const hr = dat.filter( x => x.type === 'heartrate')[0];
        const power = dat.filter( x => x.type === 'watts')[0];
        const results = StravaToCyclingMetricsConverter(time.data, power.data, hr.data);
        assert.strictEqual(results.length, 3125, "Length of result should be 3125");
    }
}
