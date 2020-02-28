const tPrimeBalance = (power : number[], cp : number, until?: number) => {
  if (typeof until === "undefined") {
    until = power.length
  }
  // todo Alex commented this out
  let avg_power_below_cp = 1 // power.slice(0, until).reduce((prev, curr) => (curr < cp && prev + curr))

  if (Number.isNaN(avg_power_below_cp)) {
    avg_power_below_cp = 0
  }
  let delta_cp = cp - avg_power_below_cp
  return 546 * Math.E ** (-0.01 * delta_cp) + 316
}

const getTau = (power: number[], cp: number, tauDynamic: boolean, tauValue?: string) : any => {
  let tau

  if (tauDynamic) {
    const tauArray:number[] = []
    for (let i = 0; i < power.length; i++) {
      tauArray.push(tPrimeBalance(power, cp, i))
    }
    tau = (t: number) => tauArray[t]
  } else if (typeof tauValue === "undefined") {
    let static_tau = tPrimeBalance(power, cp)
    tau = (t: number) => static_tau
  } else {
    tau = (t: number) => tauValue
  }
  return tau
}

export function primeBalance(
  power :number[],
  cp : number,
  w_prime : number,
  tau_dynamic: boolean = false,
  tau_value?: string)
{
  let sampling_rate = 1
  let running_sum = 0
  let w_prime_balance = []
  let tau = getTau(power, cp, tau_dynamic, tau_value)

  for (let t = 0 ;t < power.length; t++) {
    let p = power[t]
    let power_above_cp = p - cp
    let w_prime_extended = Math.max(0, power_above_cp) * sampling_rate
    running_sum =
      running_sum + w_prime_extended * Math.E ** ((t * sampling_rate) / tau(t))
    w_prime_balance.push(
      w_prime - running_sum * Math.E ** ((-t * sampling_rate) / tau(t))
    )
  }
  return w_prime_balance
}



