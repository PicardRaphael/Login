import chai from 'chai'
import mocha from 'mocha'


const expect = chai.expect
const describe = mocha.describe
const it = mocha.it


describe('Something', function() {
  it('works', function() {
    expect(true).to.eq(true);
  })
})