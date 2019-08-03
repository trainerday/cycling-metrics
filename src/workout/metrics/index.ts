export const getIntensityFactor = (segments: number[][]) => {
  if (segments.length === 0) {
    return 0
  }
  if (segments[0].length !== 3) {
    throw new Error ('must have 3 segments')
  }
  const inFac = getIntensityFactor(segments)
  return inFac
}

export const getTss = (segments: number[][]) => {
  if (segments.length === 0) {
    return 0
  }
  if (segments[0].length !== 3) {
    throw new Error ('must have 3 segments')
  }

  const tss = getTss2(segments)
  return tss
}






function getTss2(arr){
  const FTP = 100// we are not using power we are using percent of FTP.
  const ifObj = getIntensityFactor2(arr)
  const IF = ifObj.if
  const NP = ifObj.np
  const t = ifObj.seconds
  const TSS = Math.round(((t * NP * IF) / (FTP * 3600)) * 100) 
  return TSS
}



function getIntensityFactorInt(arr){
  const if2= getIntensityFactor2(arr).if
  return Math.floor(if2 * 100)/100
}

function getIntensityFactor2(arr){
  const FTP=100// we are not using power we are using percent of FTP.
  const np = getNormalizedPower(arr)
  const NP = np.np
  const IF = (NP/FTP)
  const out = {if:IF,seconds:np.seconds,np:NP}
//  console.log(out)
  return out
}


function getNormalizedPower(arr){
  const res = getOneSecondIntervals(arr)
  if (res.length<120) {return {np:0,seconds:0}}

  const mov = movingAvg(res,30)
  const filtered = mov.filter(el => {
    return el != null
  })

  const pow4 = []
  filtered.forEach(item=>{
    pow4.push(Math.pow(item,4))
  })
  const avgPow4 = average(pow4)
  const avg = Math.round(Math.pow(avgPow4,.25)*100)/100
  return {np:avg,seconds:res.length} 
}


function average(list){
  const averageLoc = list2 => list2.reduce((prev, curr) => prev + curr) / list2.length;
  return Math.round(averageLoc(list)*100)/100;
}

function getOneSecondIntervals(arr){
  const out = [];
  arr.forEach(segment=>{
  const min=segment[0]
  const pStart=segment[1]
  const pEnd=segment[2]
  const seconds=min*60
  const adder=(pEnd-pStart)/seconds
  let first=pStart
  for (let i = 0; i<seconds; i++) {
    out.push(Math.round(first*100)/100)
      first +=adder
    }
  })
  return out
}

function movingAvg(array, count){
  const avg = (array2) =>{
    let sum = 0
    array2.forEach(item=>{
      sum += item
    })
    return sum / array2.length
  }

  const result = []
  let val

  for (let i = 0; i < count - 1; i++) {result.push(null)}
  const len = array.length - count
  for (let i = 0; i <= len; i++){
    val = avg(array.slice(i, i + count))
    if (isNaN(val)) {result.push(null)}
    else {result.push(Math.round(val*100)/100)}
  }

  return result;
}

