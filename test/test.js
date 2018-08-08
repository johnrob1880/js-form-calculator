const assert = require('assert')
const calculate = require('..').calculateForm

var form = {
  formulas: {
    addition: {
        type: 'number',
        precision: '2',
        segments: [{
            top: ['one', '+', 'two'],
            bottom: []
        }]
    },
    subtraction: {
        type: 'number',
        precision: '2',
        segments: [{
            top: ['one', '-', 'two'],
            bottom: []
        }]
    },
    division: {
        type: 'number',
        precision: '2',
        segments: [{
            top: ['one'],
            bottom: ['two']
        }]
    },
    multiplication: {
        type: 'number',
        precision: '2',
        segments: [{
            top: ['one', '*', 'two'],
            bottom: []
        }]
    }
},
inputs: {
    'one': {
        type: 'number',
        validators: ['req', 'num']
    },
    'two': {
        type: 'number',
        validators: ['req', 'num']
    },
}
}

let values = {
    one: "4",
    two: 2
}

console.log()

calculate(form, values).then(form => {

    if (!form.isValid) {
        assert.fail('validation failed')        
        return
    }
    
    assert.equal(form.values.addition, 6)
    console.log(`addition \u001B[32m✓\u001B[39m 6`, form.values)

    assert.equal(form.values.subtraction, 2)
    console.log(`subtraction \u001B[32m✓\u001B[39m 2`)

    assert.equal(form.values.division, 2)
    console.log(`division \u001B[32m✓\u001B[39m 2`)

    assert.equal(form.values.multiplication, 8)
    console.log(`multiplication \u001B[32m✓\u001B[39m 8`)
}).catch(e => {
    console.log('error', e)
    assert.fail('Exception thrown')
})