
const INT_PATTERN = '^-?(0|[1-9]\\d*)$';
const NUMBER_PATTERN = '^-?(0|[1-9]\\d*)(\\.\\d+)?$';

export const validators = {
  'req': val => val !== null && typeof val !== 'undefined' && val !== '',
  'str': (val) => {
    return typeof val === 'string';
  },
  'num': (val) => {
    return validators['str'](val) 
      ? new RegExp(NUMBER_PATTERN).test(val)
      : (typeof val === 'number' && !isNaN(val))
  },
  'bool': (val) => {
    return typeof val === 'boolean'
  },
  'int': (val) => {
    return validators['str'](val) 
      ? new RegExp(INT_PATTERN).test(val)
      : (validators['num'](val) && val % 1 === 0)
  },
  'pos': val => {
    return validators['num'](val) && val > 0
  },
  'neg': val => {
    return validators['num'](val) && val < 0
  },
  'zpos': val => {
    return validators['num'](val) && val >= 0
  },  
  'gt': (val, num) => {
    return validators['num'](val) && validators['num'](num) && val > num
  },
  'gte': (val, num) => {
    return validators['num'](val) && validators['num'](num) && val >= num
  },
  'lt': (val, num) => {
    return validators['num'](val) && validators['num'](num) && val < num
  },
  'lte': (val, num) => {
    return validators['num'](val) && validators['num'](num) && val <= num
  },
  'btw': (val, min, max) => {
    return validators['num'](val) && val >= min && val <= max
  },
  'in': (val, arr) => {
    return arr instanceof Array && arr.indexOf(val) !== -1
  },
  'date': (val) => {
    return !!(new Date(val) !== 'Invalid Date') && !isNaN(new Date(val))
  }
}

export const validate = (rules, val, vargs) => {
  let errors = []
  let args = !vargs ? [val] : [val].concat(vargs)

  if (!(rules instanceof Array)) {
    if (!validators[rules].apply(null, args)) {
      errors.push(rules)
    }
    return errors
  }

  [].forEach.call(rules, r => {
    if (!validators.hasOwnProperty(r)) {
      return
    }

    if (!validators[r].apply(null, args)) {
      errors.push(r)
    }
  })

  return errors
}