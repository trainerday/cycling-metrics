  getIntensityFactor(segments) {
    if (segments.length === 0) return 0
    var seg30 = getSeg30(segments)
    var inFac = getIntensityFactor(seg30)
    return inFac
  },
  getWorkoutWithStatus(segments, title, intensityFactor, minutes) {
    return getWorkoutWithStatus(segments, title, intensityFactor, minutes)
  },
  getTimeInZones(segments) {
    return getTimeInZone(segments)
  },
  getDominantZone(segments) {
    if (segments.length === 0) return ''
    return zones[getDominantZone(segments)]
  }
}
export default workoutMath

var zones = [null, 'Recovery', 'Endurance', 'Tempo', 'Threshold', 'VO2Max', 'Anaerobic'] // Strenght
// var sufferfest_shovel = [[9, 50, 60], [6.67, 60, 90], [0.17, 180, 180], [1.33, 45, 45], [0.17, 140, 140], [1.33, 45, 45], [1, 95, 95], [0.1, 35, 35], [0.9, 110, 110], [0.2, 35, 35], [0.8, 110, 110], [0.3, 35, 35], [0.7, 112, 112], [0.4, 35, 35], [0.6, 115, 115], [0.5, 35, 35], [0.5, 125, 125], [0.6, 35, 35], [0.4, 150, 150], [0.7, 35, 35], [0.3, 175, 175], [0.8, 35, 35], [0.2, 190, 190], [0.9, 35, 35], [0.1, 200, 200], [0.95, 35, 35], [0.05, 220, 220], [0.95, 35, 35], [0.05, 220, 220], [0.9, 35, 35], [0.1, 200, 200], [0.8, 35, 35], [0.2, 190, 190], [0.7, 35, 35], [0.3, 175, 175], [0.6, 35, 35], [0.4, 150, 150], [0.5, 35, 35], [0.5, 125, 125], [0.4, 35, 35], [0.6, 115, 115], [0.3, 35, 35], [0.7, 112, 112], [0.2, 35, 35], [0.8, 110, 110], [0.1, 35, 35], [0.9, 110, 110], [5, 35, 35], [0.05, 220, 220], [0.95, 35, 35], [0.05, 220, 220], [0.9, 35, 35], [0.1, 200, 200], [0.8, 35, 35], [0.2, 190, 190], [0.7, 35, 35], [0.3, 175, 175], [0.6, 35, 35], [0.4, 150, 150], [0.5, 35, 35], [0.5, 125, 125], [0.4, 35, 35], [0.6, 115, 115], [0.3, 35, 35], [0.7, 112, 112], [0.2, 35, 35], [0.8, 110, 110], [0.1, 35, 35], [0.9, 95, 95], [0.1, 35, 35], [0.9, 90, 90], [1, 35, 35], [1, 95, 95], [0.1, 35, 35], [0.9, 110, 110], [0.2, 35, 35], [0.8, 110, 110], [0.3, 35, 35], [0.7, 112, 112], [0.4, 35, 35], [0.6, 115, 115], [0.5, 35, 35], [0.5, 125, 125], [0.6, 35, 35], [0.4, 150, 150], [0.7, 35, 35], [0.3, 175, 175], [0.8, 35, 35], [0.2, 190, 190], [0.9, 35, 35], [0.1, 200, 200], [0.95, 35, 35], [0.05, 220, 220], [5, 35, 35]]
// var test = [[20, 300, 300]]
// console.log(getTss(test))

function getTss(segments) {
  var seg30 = getSeg30(segments)
  var inFac = getIntensityFactor(seg30)
  var minutes = getMinutes(segments)
  var tss = getTssInt(minutes, inFac)
  return tss
}

function getWorkoutWithStatus(segments, title, intensityFactor, minutes) {
  segments.forEach((segment) => {
    if (segment[2] === null || isNaN(segment[2])) {
      segment[2] = segment[1]
    }
  })

  var wo = { isPrivate: 'delete' }
  var lowestPower = getLowestPower(segments)
  var sum = _.reduce(
    segments,
    function(memo, num) {
      return memo + num[0]
    },
    0
  )
  wo.minutes = sum
  wo.timeType = getTimeType(sum)
  wo.timeInZones = getTimeInZone(segments)
  wo.ergdb_wo_type = zones[getDominantZone(segments)]
  wo.group = getGroup(wo.timeType, wo.timeInZones)

  var titleLower = ''
  if (typeof title !== 'undefined') {
    titleLower = title.toLowerCase().trim()
  }

  if (
    !isPossible(intensityFactor, minutes) ||
    titleLower.startsWith('test ') ||
    titleLower.endsWith(' test') ||
    titleLower === 'test' ||
    titleLower.indexOf(' test ') > -1
  ) {
    wo.ergdb_wo_type = 'Test'
  }

  if (lowestPower >= 1) {
    wo.isPrivate = 'no'
    if (getMaxPower(segments) <= 64 || wo.ergdb_wo_type === 'Test') {
      wo.isPrivate = 'yes'
    }
    if (lowestPower < 20) {
      wo.isPrivate = 'yes'
    }
  }

  return wo
}

function isPossible(intensityFactor, minutes) {
  if (minutes >= 60 && intensityFactor > 1.2) {
    return false
    // 1.2 to allow for incorrect zone setting
  }

  if (minutes >= 30 && intensityFactor > 1.5) {
    return false
  }
  return true
}

function getGroup(timeType, timeInZones) {
  var strOut = ''
  var strOut2 = ''
  for (var property in timeInZones) {
    if (property !== 'z1' && property !== 'z2') {
      strOut = strOut + '_' + getClosest(timeInZones[property])
    }
    strOut2 = strOut2 + '_' + getClosest(timeInZones[property])
  }
  if (strOut === '_0_0_0_0_0') strOut = strOut2
  return (timeType + strOut).replace(' ', '_').toLowerCase()
}

function getClosest(goal) {
  // minArr is just a way to find approximate times in minutes for simple grouping
  var minArr = [0, 0.1, 0.2, 0.5, 1, 2, 3, 5, 8, 11, 17, 26, 38, 58, 86, 130, 195, 292]
  var closest = minArr.reduce(function(prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
  })
  return closest
}

function getDominantZone(segments) {
  var timeInZones = [
    { zone: 1, contribution: 0, seconds: 0 },
    { zone: 2, contribution: 0, seconds: 0 },
    { zone: 3, contribution: 0, seconds: 0 },
    { zone: 4, contribution: 0, seconds: 0 },
    { zone: 5, contribution: 0, seconds: 0 },
    { zone: 6, contribution: 0, seconds: 0 },
    { zone: 7, contribution: 0, seconds: 0 }
  ]
  var contributions = getZoneContributions(segments)
  contributions.forEach((segment) => {
    var match = _.filter(timeInZones, (zone) => {
      return zone.zone === segment.zone
    })
    match[0].contribution += segment.contribution
    match[0].seconds += segment.seconds
  })

  var z1 = _.filter(timeInZones, (zone) => {
    return zone.zone === 1
  })[0]
  var z2 = _.filter(timeInZones, (zone) => {
    return zone.zone === 2
  })[0]
  var z3 = _.filter(timeInZones, (zone) => {
    return zone.zone === 3
  })[0]
  var z4 = _.filter(timeInZones, (zone) => {
    return zone.zone === 4
  })[0]
  var z5 = _.filter(timeInZones, (zone) => {
    return zone.zone === 5
  })[0]
  var z6 = _.filter(timeInZones, (zone) => {
    return zone.zone === 6
  })[0]
  if (
    z3.seconds / 60 >= 10 ||
    z4.seconds / 60 >= 6 ||
    z5.seconds / 60 >= 2 ||
    z6.seconds / 60 >= 1
  ) {
    z1.contribution = 0
    z2.contribution = 0
  }

  var primary = _.max(timeInZones, function(zone) {
    return zone.contribution
  })

  return primary.zone
}

function getZoneContributions(segments) {
  var out = []
  segments.forEach((segment) => {
    var avgFtpPercent = (segment[1] + segment[2]) / 2
    var obj = { seconds: segment[0] * 60 }
    obj.percentOfFtp = avgFtpPercent
    obj.timeMultiplier = getTimeMultiplier(avgFtpPercent / 100)
    obj.zone = getZoneNumber(avgFtpPercent)
    obj.contribution = obj.timeMultiplier * obj.seconds
    out.push(obj)
  })

  return out
}

function getTimeMultiplier(avgFtpPercent) {
  // domintant came from Mark at GoldenCheetah
  var dominant = [
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
    { PercentOfFtp: 0.51, TimeMultiplier: 0.1 }
  ]
  for (var i = dominant.length - 1; i >= 0; i--) {
    if (avgFtpPercent < dominant[i].PercentOfFtp) {
      return dominant[i].TimeMultiplier
    }
  }

  return null
}

function getTimeInZone(segments) {
  var toz = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0 }

  segments.forEach((segment) => {
    var avgPower = (segment[1] + segment[2]) / 2
    var zone = getZone(avgPower)
    toz[zone] += segment[0] // add the time
  })
  toz.z1 = Math.round(toz.z1)
  toz.z2 = Math.round(toz.z2)
  toz.z3 = Math.round(toz.z3)
  toz.z4 = Math.round(toz.z4)
  toz.z5 = Math.round(toz.z5)
  toz.z6 = Math.round(toz.z6)

  return toz
}

function getZone(avgPower) {
  return 'z' + getZoneNumber(avgPower)
}

function getZoneNumber(avgPower) {
  var zone = 0
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

function getLowestPower(segments) {
  var lowestPower = 1000

  segments.forEach((segment) => {
    if (segment[1] < lowestPower) lowestPower = segment[1]
    if (segment[2] < lowestPower) lowestPower = segment[2]
  })
  return lowestPower
}

function getMaxPower(segments) {
  var maxPower = 0
  segments.forEach((segment) => {
    if (segment[1] > maxPower) maxPower = segment[1]
    if (segment[2] > maxPower) maxPower = segment[2]
  })
  return maxPower
}

function getTimeType(minutes) {
  if (minutes <= 30) return '30 Min'
  if (minutes <= 50) return '45 Min'
  if (minutes <= 65) return '60 Min'
  if (minutes <= 80) return '75 Min'
  if (minutes <= 100) return '90 Min'
  if (minutes <= 160) return '2 Hrs'
  return '3 Plus'
}
