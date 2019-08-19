import _ from 'lodash';
import * as utils from '../common/utils'

export function getIntensityFactor2(powerValues: number[]){
  const FTP=100// we are not using power we are using percent of FTP.
  const {np:NP, seconds:seconds} = getNormalizedPower(powerValues)
  const IF = (NP/FTP)
  return {if:IF, seconds, np:NP}
}

export function getTss(powerValues: number[]){
  const FTP = 100// we are not using power we are using percent of FTP.
  const {if:IF, seconds:t, np:NP} = getIntensityFactor2(powerValues)
  return _.round(((t * NP * IF) / (FTP * 3600)) * 100)
}

function getIntensityFactorInt(powerValues: number[]){
  const if2 = getIntensityFactor2(powerValues).if
  return _.floor(if2,2)
}

function getNormalizedPower(powerValues: number[]){
  if (powerValues.length < 120) {
    return {np:0, seconds:0}
  }
  const mvAvg =  utils.movingAverage(powerValues, 30)
  const avgPow4 = _.sumBy(mvAvg, x => _.round(Math.pow(x,4),2)) / mvAvg.length
  const avg = _.round(Math.pow(avgPow4,.25),2)
  return {np:avg, seconds:powerValues.length } 
}
