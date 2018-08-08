/*
 * JS Form Calculator
 * Calculates form objects
 * https://github.com/johnrob1880/js-form-calculator
 *
 * Copyright (c) 2018 John Robinson
 * Licensed under the MIT license.
 */

import * as calculations from './calculations'
import { validate } from './validations'
import readProp from './readProp'

export const validateForm = (form, values) => {
  return new Promise(function (resolve, reject) {
    let inputs = (form && form.inputs) || {}
    let errObj = {}
    let isValid = true;
    let newValues = Object.assign({}, values);

    // Evaluate constants
    if (form.constants) {
      Object.keys(form.constants).forEach(key => {
        newValues[key] = form.constants[key]
      })
    }

    // Evaluate lookups
    if (form.lookups) {
      Object.keys(form.lookups).forEach(key => {
        let lookup = form.lookups[key]
        let propArr = []

        if (lookup.keys) {
          [].forEach.call(lookup.keys, a => {
            if (newValues.hasOwnProperty(a)) {
              propArr.push(newValues[a])
            }
          })

          let realValue = readProp(lookup.values, propArr.join('.'))

          newValues[key] = realValue
        }
      })
    }

    [].forEach.call(Object.keys(inputs), key => {
      let inp = inputs[key]
      let errors = validate(inp.validators || [], newValues[key])

      if (errors && errors.length) {
        isValid = false
        errObj[key] = errors
      }
    })

    if (!isValid) {
      reject(errObj)
    }

    resolve(values)
  })
}

export const calculateForm = (form, values) => {
  return new Promise((resolve, reject) => {
    calculations.calculateForm(form, values).then((newValues) => {
      resolve({
        values: newValues,
        isValid: true
      })
    }).catch((err) => {
      resolve({
        values: values,
        isValid: false,
        errors: err.errors || err
      })
    })
  })
}
