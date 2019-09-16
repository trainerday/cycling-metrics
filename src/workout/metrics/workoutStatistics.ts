import { getDominantZone, getTimeInZone } from './zones/zones'
import { getIntensityFactor, getTss } from './stress-intensity/trainingStressAndIntensityFactor'


export const getWorkoutStats = (ftp: number, powerValues: number[]) => {
  const tts = getTss(ftp, powerValues)
  const intensityFactor = getIntensityFactor(ftp, powerValues)
  const timeInZones = getTimeInZone(ftp, powerValues)
  const dominantZone = getDominantZone(ftp, powerValues)
  return {
    DominantZone: dominantZone,
    Intensity: intensityFactor.if,
    TimeZone1: timeInZones.z1,
    TimeZone2: timeInZones.z2,
    TimeZone3: timeInZones.z3,
    TimeZone4: timeInZones.z4,
    TimeZone5: timeInZones.z5,
    TimeZone6: timeInZones.z6,
    TotalMinutes: intensityFactor.seconds / 60,
    TotalStress: tts,
  }
}
