import * as _ from 'lodash'

export const getTss = (segments: number[][]) => {
  if (segments.length === 0) {return 0}
  if (segments[0].length !== 3) {throw new Error ('must have 3 segments')}

  const seg30 = getSeg30(segments)
  const inFac = getIntensityFactor(seg30)
  const minutes = getMinutes(segments)
  const tss = getTssInt(minutes, inFac)
  return tss
}

function getIntensityFactor(segments: number[]) {
  const seg30power4 = []
  segments.forEach((segment30) => {
    if (!isNaN(segment30)) {
      seg30power4.push(Math.pow(segment30, 4))
    }
  })
  let sum = 0

  seg30power4.forEach((item) => {
    sum += item
  })
  const avg = sum / seg30power4.length
  const val = Math.pow(avg, 0.25)
  return Math.round(val) / 100
}

function getTssInt(minutes: number, intensityFactor: number) {
  // from joe friel https://www.joefrielsblog.com/2011/06/oops-what-is-tss.html
  const NP = 100 * intensityFactor
  const FTP = 100
  const tss = ((minutes * 60 * NP * intensityFactor) / (FTP * 3600)) * 100
  return Math.round(tss)
}

function getMinutes(segments: number[][]) {
  let minutes = 0
  segments.forEach((segment) => {
    minutes = minutes + segment[0]
  })
  return minutes
}

class Loop {
    public remainder: number
    public value: number
}

function getSeg30(segmentsIn: number[][]) {
  const segments = JSON.parse(JSON.stringify(segmentsIn))
  const seg30 = []
  const next = new Loop()
  next.remainder = 0
  let value = 0

  segments.forEach((segment) => {
 

    if (next.remainder !== 0) {
      segment[0] = segment[0] - next.remainder
      value = Math.pow((Math.pow(next.value, 4) + Math.pow(segment[2], 4)) / 2, 0.25)
      seg30.push(value)
      // not perfect but averages previous segment piece and current one.
    }
    for (let i = 0; i < segment[0]; i = i + 0.5) { // loops through 30 second
      value = (segment[1] + segment[2]) / 2
      const remainder = segment[0] - i
      if (remainder < 0.5) {
        next.remainder = remainder
        next.value = value
        // last part of ride is lost <30 seconds
      } else {
        seg30.push(value)
        next.remainder = 0
        next.value = 0
      }
    }
  })

  return seg30
}
