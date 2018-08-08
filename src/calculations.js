import stringCalc from '@johnrob1880/string-calc'
import {
  validate,
  validators
} from './validations'

const readProp = (obj, str) => {
  return str.split('.').reduce((a, b) => {
    return a[b]
  }, obj)
}

export const calculateForm = (form, values) => {
  return new Promise(function (resolve, reject) {
    if (!form) {
      reject(new Error('A form object is required'))
      return
    }
    if (!form.hasOwnProperty('formulas')) {
      reject(new Error('At least one formula is required.'))
      return
    }

    let inputs = form.inputs

    if (form.constants) {
      Object.keys(form.constants).forEach(key => {
        values[key] = form.constants[key]
      })
    }

    if (form.lookups) {
      Object.keys(form.lookups).forEach(key => {
        let lookup = form.lookups[key]
        let propArr = []

        if (lookup.keys) {
          [].forEach.call(lookup.keys, a => {
            if (values.hasOwnProperty(a)) {
              propArr.push(values[a])
            }
          })

          let realValue = readProp(lookup.values, propArr.join('.'))

          values[key] = realValue
        }
      })
    }

    // Validate inputs
    let validationErrors = {};

    [].forEach.call(Object.keys(form.inputs), key => {
      let inp = form.inputs[key]
      let errors = validate(inp.validators || [], values[key])

      if (errors && errors.length) {
        validationErrors[key] = errors
      }
    })

    if (Object.keys(validationErrors).length) {   
      let err = new Error('Validation Failed');
      err.errors = validationErrors   
      reject(err)
      return
    }

    Object.keys(form.formulas).forEach(key => {
      let formula = form.formulas[key]

      formula.segments.forEach((s, i) => {
        let top = ''
        let bottom = ''

        if (s.top && s.top.length) {
          s.top.forEach(t => {
            if (values.hasOwnProperty(t)) {
              let input = inputs[t]

              let val = values[t]

              if (input && input.type === 'date') {
                top += "'" + val + "'"
              } else {
                top += val
              }
            } else {
              top += t
            }
          })
        }
        if (s.bottom && s.bottom.length) {
          s.bottom.forEach(b => {
            if (values[b]) {
              let val = values[b]

              bottom += val
            } else {
              bottom += b
            }
          })
        }

        let topErr = null;
        let topValue = validators['num'](top) ? top : (top && stringCalc(top, (e) => topErr = e))
        
        if (topErr) {
          let topEx = new Error(topErr);
          topEx.errors = {}
          topEx.errors[key] = 'invalid formula'
          reject(topEx)
          return
        }

        let bottomErr = null;
        let bottomValue = validators['num'](bottom) ? bottom : (bottom && stringCalc(bottom, (e) => bottomErr = e))

        if (bottomErr) {
          let bottomEx = new Error(bottomErr);
          bottomEx.errors = {}
          bottomEx.errors[key] = 'invalid formula'
          reject(bottomEx)
          return
        }

        let result = topValue

        if (formula.type && formula.type === 'number') {
          if (bottomValue && bottomValue !== 0) {
            try {
              result = topValue / parseFloat(bottomValue)
            } catch (e) {
              reject(new Error('Unable to calculate.'))
              return
            }
          }

          var precision = parseInt(formula.precision || '0')

          if (s.multiplier) {
            let multiplier = 1

            try {
              multiplier = values.hasOwnProperty(s.multiplier) ?
                parseFloat(values[s.multiplier]) :
                parseFloat(s.multiplier)
            } catch (e) {
              multiplier = 1
            }

            if (multiplier) {
              result = result * multiplier
            }
          }

          if (formula.units === 'percentage') {
            result = result * 100
          }

          result = parseFloat(((result.toFixed && result.toFixed(precision)) || result))
        }

        let fns = {
          '+': (val, result) => val + result,
          '-': (val, result) => val - result,
          '*': (val, result) => val * result,
          '/': (val, result) => val / result
        }

        let operator = s.operator || '+'
        values[key] = i === 0 ? result : ((fns[operator] && fns[operator](values[key], result)) || result)
      })
    })

    resolve(values)
  })
}