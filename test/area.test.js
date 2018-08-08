const assert = require('assert')
const calculate = require('..').calculateForm

var form = {
    formulas: {
		area:  {
			type: 'number', 
			precision: '2',
		 	segments: [{
				top: ['height', '*', 'width'], 
				'bottom': [] 
			}] 
		}    
    },
    inputs: {
        height: { type: 'number', validators: ['req'] },
        width: { type: 'number', validators: ['req'] }
	}
}

let values = { height: 10.2, width: 20.5 }

calculate(form, values).then(form => {
	assert.equal(form.values.area, 209.1)
	console.log(`\u001B[32m✓\u001B[39m 209.1`)
}).catch( e => {
	console.log('error', e)
	assert.fail('Exception thrown')
})
