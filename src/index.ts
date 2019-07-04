import { zip } from "lodash";

export const StravaToCyclingMetricsConverter = (secondsArr : Array<Number>, powerArr:Array<Number>, hrArray :Array<Number>) => {
    // prevent interpolating results array with undefined values
    if( secondsArr.length !== powerArr.length || 
        secondsArr.length !== hrArray.length ||
        powerArr.length !== hrArray.length)
        {
            throw new Error("All arrays must be of equal length");
        }
    
    return zip(secondsArr, powerArr, hrArray);
}