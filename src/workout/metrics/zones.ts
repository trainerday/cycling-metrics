import _ from 'lodash'


export const getTimeInZone = (ftp: number, powerValues: number[]) => {
  const ftpPercents = _.map(powerValues, power => (power / ftp) * 100)
  const zonesContrib = getZoneContributions(ftpPercents)
  const groupedContrib = _.groupBy(zonesContrib, x => x.zone)
  const getLength = (x: any) => (x === undefined ? 0 : x.length)
  return {
    z1: getLength(groupedContrib[1]),
    z2: getLength(groupedContrib[2]),
    z3: getLength(groupedContrib[3]),
    z4: getLength(groupedContrib[4]),
    z5: getLength(groupedContrib[5]),
    z6: getLength(groupedContrib[6]),
  }
}

export const getDominantZone = (ftp: number, powerValues: number[]) => {
  const ftpPercents = _.map(powerValues, power => (power / ftp) * 100)
  const zonesContrib = getZoneContributions(ftpPercents)
  const groupedContrib = _.groupBy(zonesContrib, x => x.zone)
  let zoneResults = _.map(groupedContrib, x => ({
    seconds: x.length,
    contrib: _.sumBy(x, c => c.timeMultiplier!),
    zone: x[0].zone,
  }))

  const higherZoneExists = _.some(
    zoneResults,
    ({ seconds, zone }) =>
      (seconds >= 600 && zone === 3) ||
      (seconds >= 360 && zone === 4) ||
      (seconds >= 120 && zone === 5) ||
      (seconds >= 60 && zone === 6),
  )
  if (higherZoneExists) {
    zoneResults = _.filter(zoneResults, x => x.zone > 2)
  }
  // @ts-ignore
  return _.maxBy(zoneResults, x => x.contrib).zone
}

function getTimeMultiplier(ftpPercent: number) {
  // dominant came from Mark at GoldenCheetah
  const dominant = [
    { PercentOfFtp: 4.17, TimeMultiplier: 3600 },
    { PercentOfFtp: 4.08, TimeMultiplier: 1800 },
    { PercentOfFtp: 4.01, TimeMultiplier: 1200 },
    { PercentOfFtp: 3.93, TimeMultiplier: 900 },
    { PercentOfFtp: 3.85, TimeMultiplier: 720 },
    { PercentOfFtp: 3.77, TimeMultiplier: 600 },
    { PercentOfFtp: 3.7, TimeMultiplier: 514.29 },
    { PercentOfFtp: 3.63, TimeMultiplier: 450 },
    { PercentOfFtp: 3.57, TimeMultiplier: 400 },
    { PercentOfFtp: 3.5, TimeMultiplier: 360 },
    { PercentOfFtp: 3.43, TimeMultiplier: 327.27 },
    { PercentOfFtp: 3.38, TimeMultiplier: 300 },
    { PercentOfFtp: 3.32, TimeMultiplier: 276.92 },
    { PercentOfFtp: 3.27, TimeMultiplier: 257.14 },
    { PercentOfFtp: 3.2, TimeMultiplier: 240 },
    { PercentOfFtp: 3.14, TimeMultiplier: 225 },
    { PercentOfFtp: 3.08, TimeMultiplier: 211.76 },
    { PercentOfFtp: 3.03, TimeMultiplier: 200 },
    { PercentOfFtp: 2.98, TimeMultiplier: 189.47 },
    { PercentOfFtp: 2.93, TimeMultiplier: 180 },
    { PercentOfFtp: 2.89, TimeMultiplier: 171.43 },
    { PercentOfFtp: 2.85, TimeMultiplier: 163.64 },
    { PercentOfFtp: 2.81, TimeMultiplier: 156.52 },
    { PercentOfFtp: 2.77, TimeMultiplier: 150 },
    { PercentOfFtp: 2.72, TimeMultiplier: 144 },
    { PercentOfFtp: 2.55, TimeMultiplier: 120 },
    { PercentOfFtp: 2.39, TimeMultiplier: 102.86 },
    { PercentOfFtp: 2.27, TimeMultiplier: 90 },
    { PercentOfFtp: 2.16, TimeMultiplier: 80 },
    { PercentOfFtp: 1.96, TimeMultiplier: 60 },
    { PercentOfFtp: 1.74, TimeMultiplier: 40 },
    { PercentOfFtp: 1.61, TimeMultiplier: 30 },
    { PercentOfFtp: 1.54, TimeMultiplier: 24 },
    { PercentOfFtp: 1.49, TimeMultiplier: 20 },
    { PercentOfFtp: 1.45, TimeMultiplier: 17.14 },
    { PercentOfFtp: 1.42, TimeMultiplier: 15 },
    { PercentOfFtp: 1.39, TimeMultiplier: 13.33 },
    { PercentOfFtp: 1.37, TimeMultiplier: 12 },
    { PercentOfFtp: 1.34, TimeMultiplier: 10 },
    { PercentOfFtp: 1.3, TimeMultiplier: 8.57 },
    { PercentOfFtp: 1.28, TimeMultiplier: 7.5 },
    { PercentOfFtp: 1.26, TimeMultiplier: 6.67 },
    { PercentOfFtp: 1.25, TimeMultiplier: 6 },
    { PercentOfFtp: 1.24, TimeMultiplier: 5.45 },
    { PercentOfFtp: 1.23, TimeMultiplier: 5 },
    { PercentOfFtp: 1.21, TimeMultiplier: 4.62 },
    { PercentOfFtp: 1.2, TimeMultiplier: 4.29 },
    { PercentOfFtp: 1.2, TimeMultiplier: 4 },
    { PercentOfFtp: 1.19, TimeMultiplier: 3.75 },
    { PercentOfFtp: 1.18, TimeMultiplier: 3.53 },
    { PercentOfFtp: 1.18, TimeMultiplier: 3.33 },
    { PercentOfFtp: 1.17, TimeMultiplier: 3.16 },
    { PercentOfFtp: 1.17, TimeMultiplier: 3 },
    { PercentOfFtp: 1.15, TimeMultiplier: 2.86 },
    { PercentOfFtp: 1.15, TimeMultiplier: 2.73 },
    { PercentOfFtp: 1.14, TimeMultiplier: 2.61 },
    { PercentOfFtp: 1.13, TimeMultiplier: 2.5 },
    { PercentOfFtp: 1.12, TimeMultiplier: 2.4 },
    { PercentOfFtp: 1.12, TimeMultiplier: 2.31 },
    { PercentOfFtp: 1.11, TimeMultiplier: 2.22 },
    { PercentOfFtp: 1.11, TimeMultiplier: 2.14 },
    { PercentOfFtp: 1.11, TimeMultiplier: 2.07 },
    { PercentOfFtp: 1.1, TimeMultiplier: 2 },
    { PercentOfFtp: 1.09, TimeMultiplier: 1.88 },
    { PercentOfFtp: 1.08, TimeMultiplier: 1.76 },
    { PercentOfFtp: 1.08, TimeMultiplier: 1.67 },
    { PercentOfFtp: 1.07, TimeMultiplier: 1.58 },
    { PercentOfFtp: 1.07, TimeMultiplier: 1.5 },
    { PercentOfFtp: 1.06, TimeMultiplier: 1.43 },
    { PercentOfFtp: 1.05, TimeMultiplier: 1.36 },
    { PercentOfFtp: 1.04, TimeMultiplier: 1.3 },
    { PercentOfFtp: 1.03, TimeMultiplier: 1.25 },
    { PercentOfFtp: 1.03, TimeMultiplier: 1.2 },
    { PercentOfFtp: 1.02, TimeMultiplier: 1.15 },
    { PercentOfFtp: 1.02, TimeMultiplier: 1.11 },
    { PercentOfFtp: 1.01, TimeMultiplier: 1.07 },
    { PercentOfFtp: 1.01, TimeMultiplier: 1.03 },
    { PercentOfFtp: 1, TimeMultiplier: 1 },
    { PercentOfFtp: 0.98, TimeMultiplier: 0.92 },
    { PercentOfFtp: 0.98, TimeMultiplier: 0.86 },
    { PercentOfFtp: 0.96, TimeMultiplier: 0.8 },
    { PercentOfFtp: 0.95, TimeMultiplier: 0.75 },
    { PercentOfFtp: 0.93, TimeMultiplier: 0.69 },
    { PercentOfFtp: 0.93, TimeMultiplier: 0.65 },
    { PercentOfFtp: 0.92, TimeMultiplier: 0.62 },
    { PercentOfFtp: 0.91, TimeMultiplier: 0.59 },
    { PercentOfFtp: 0.9, TimeMultiplier: 0.56 },
    { PercentOfFtp: 0.89, TimeMultiplier: 0.54 },
    { PercentOfFtp: 0.88, TimeMultiplier: 0.51 },
    { PercentOfFtp: 0.88, TimeMultiplier: 0.5 },
    { PercentOfFtp: 0.79, TimeMultiplier: 0.33 },
    { PercentOfFtp: 0.72, TimeMultiplier: 0.25 },
    { PercentOfFtp: 0.67, TimeMultiplier: 0.2 },
    { PercentOfFtp: 0.63, TimeMultiplier: 0.17 },
    { PercentOfFtp: 0.59, TimeMultiplier: 0.14 },
    { PercentOfFtp: 0.57, TimeMultiplier: 0.13 },
    { PercentOfFtp: 0.55, TimeMultiplier: 0.11 },
    { PercentOfFtp: 0.51, TimeMultiplier: 0.1 },
  ]
  for (let i = dominant.length - 1; i >= 0; i--) {
    if (ftpPercent < dominant[i].PercentOfFtp) {
      return dominant[i].TimeMultiplier
    }
  }
  return null
}

function getZoneNumber(avgPower: number) {
  let zone = 0
  if (avgPower <= 55) {
    zone = 1
  } else if (avgPower <= 75) {
    zone = 2
  } else if (avgPower <= 90) {
    zone = 3
  } else if (avgPower <= 105) {
    zone = 4
  } else if (avgPower <= 120) {
    zone = 5
  } else {
    zone = 6
  }
  return zone
}

function getZoneContributions(ftpPercents: number[]) {
  return _.map(ftpPercents, f => ({ timeMultiplier: getTimeMultiplier(f / 100), zone: getZoneNumber(f) }))
}
