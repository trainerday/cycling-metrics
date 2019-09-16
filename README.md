# Cycling Metrics

Cycling power data analysis.  Includes both single workout analysis as well as multiple workout analysis.  Takes data directly from Strava API Stream array format. Created in Type Script. Al

## Getting Started

npm install @trainerday/cycling-metrics --save


```
var cm = require('@trainerday/cycling-metrics')

const power = [102, 106, 110, 114, 118, 120, 116, 112, 108, 104, 100]
const mmp = cm.getMeanMaxPowerCurve(power)
console.log(mmp)
//120,119,118,117,116,115,114,113,112,111,110

//we support power ramps, start at one percent and end at another 

const intervals = [[30,100,100],[30,100,100]] // minutes, wattsStart, wattsEnd
const trainingStress = cm.getTrainingStress(100, intervals) //ftp watts + intervals
console.log(trainingStress)
//100  60 minutes @100w with 100w ftp by definition is ts = 100


```

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* Type Script
* Jest (Testing framework)
* ESlint

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **TrainerDay** - *Sponsor*
* **Artur Tadrala** - *Initial work*
* **Alex VanLaningham** - *Initial work*

See also the list of [contributors](https://github.com/trainerday/cycling-metrics/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Special thanks to 
    - Mark from GoldenCheetah
    - TrainingPeaks and Coggan for their leadership in volume based research
* Hat tip to anyone whose code was used
* Inspiration
* etc
