const LM = require('ml-levenberg-marquardt')

// @ts-ignore
function two_parameter_non_linear_predict([cp, w_prime]) {
  return (t: number) => cp + w_prime / t
}
// @ts-ignore
function three_parameter_non_linear_predict([cp, w_prime, p_max]) {
  return (t: number) => w_prime / (t + w_prime / (p_max - cp)) + cp
}

function model_fit(x: number[], y: number[], model = '2_parameter_non_linear') {
  let predict_func = undefined
  let initial_model_params = undefined

  switch (model) {
    case '2_parameter_non_linear':
      predict_func = two_parameter_non_linear_predict
      initial_model_params = [300, 20000]
      break
    case '3_parameter_non_linear':
      predict_func = three_parameter_non_linear_predict
      initial_model_params = [300, 20000, 1000]
      break
  }

  const data = {
    x: x,
    y: y,
  }
  const initial_values = initial_model_params
  const options = {
    damping: 1.5,
    initialValues: initial_values,
    gradientDifference: 10e-2,
    maxIterations: 100,
    errorTolerance: 10e-3,
  }
  return LM(data, predict_func, options)
}

const time_axis = []
for (let i = 1; i < 1800; i += 10) {
  time_axis.push(i)
}

const max_efforts = []
for (let i = 0; i < 18; i++) {
  max_efforts.push(400)
}

for (let i = 0; i < time_axis.length - 18; i++) {
  max_efforts.push(200) //val = 10000 / time_axis[i] + 200
}

//fitted_params = model_fit(time_axis, max_efforts, '3_parameter_non_linear')
const fitted_params = model_fit(time_axis, max_efforts, '2_parameter_non_linear')
console.log(fitted_params)
// console.log(time_axis)
// console.log(max_efforts)
