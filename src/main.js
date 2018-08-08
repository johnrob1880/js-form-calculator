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

export const validateForm = (form, values) => {
  return new Promise(function (resolve, reject) {
    let inputs = (form && form.inputs) || {}
    let errObj = {}
    let isValid = true;

    [].forEach.call(Object.keys(inputs), key => {
      let inp = inputs[key]
      let errors = validate(inp.validators || [], values[key])

      if (errors && errors.length) {
        isValid = false
        errObj[key] = errors
      }
    })

    if (!isValid) {
      reject(errObj)
    }

    resolve()
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
