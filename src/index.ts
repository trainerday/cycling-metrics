import { zip } from "lodash";

export const Greeter = (name: string) => `Hello ${name}`;

export const StravaToCyclingMetricsConverter = (secondsArr : Array<Number>, powerArr:Array<Number>, hrArray :Array<Number>) => {
    return zip(secondsArr, powerArr, hrArray);
}