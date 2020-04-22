export default function(power: [number], cp: number, wPrime: number) {
  let lastOne = wPrime
  let newOne
  const wPrimeBalance = []

  for (const p of power) {
    if (p < cp) {
      newOne = lastOne + ((cp - p) * (wPrime - lastOne)) / wPrime
    } else {
      newOne = lastOne + (cp - p)
    }

    wPrimeBalance.push(newOne)
    lastOne = newOne
  }

  return wPrimeBalance
}
