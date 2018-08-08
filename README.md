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

Clone this repository and install its dependencies:

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

## License

[MIT](LICENSE).
