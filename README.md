# js-form-calculator

A useful JavaScript form calculation library.


Install with the node package manager:

```bash
npm install @johnrob1880/js-form-calculator --save
```

Install with the yarn package manager:

```bash
yarn add @johnrob1880/js-form-calculator
```

## Usage

```js
import calculateFrom from '@johnrob1880/js-form-calculator'

let values = { "height": 10, "width": 10 }
let form = {
    "formulas": {
		"area":  {
			"type": "number", 
			"precision": "2",
		 	"segments": [{
                    "top": ["height", "*", "width"], 
                    "bottom": [] 
			}] 
		}    
    },
    "inputs": {
        "height": { "type": "number", "validators": ["req"] },
        "width": { "type": "number", "validators": ["req"] }
    }
}

calculateForm(form, values).then(result => {
    console.log(result)
    // outputs
    // { 
    //     values: { height: 10, width: 10, area: 100 },
    //     isValid: true
    // }   

}).catch( e => {
	console.log('error', e)
	assert.fail('Exception thrown')
})
```

## Supported Validators

`req` - required

`str`, `num`, `bool`, `int` - value type

`pos` - positive number

`zpos` - positive number including zero

`neg` - negative number

`gt` - greater than

`gte` - greater than or equal to

`lt` - less than

`lte` - less than or equal to

`btw` - between a min and max value

`in` - a value in a set of values

`date` - a valid date

## Validator options example

```js

// greater than 10
`gt`: { type: 'number', validators: ['req', 'gt'], vargs: [10] }

// greater than or equal to 10
`gte`: { type: 'number', validators: ['req', 'gt'], vargs: [10] }

// length between 1 and 10
`btw`: { type: 'number', validators: ['req', 'btw'], vargs: [1, 10] }

// in a set of values, be sure to pass an array
`in`: { type: 'number', validators: ['req', 'in'], vargs: [[1, 11]]}
```

## License

[MIT](LICENSE).
