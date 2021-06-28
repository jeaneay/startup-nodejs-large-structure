const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const server = require('../../dist/utils/server');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

describe('UTILS SERVER', function() {

    describe('#xUnit: getNormalizePort', function() {

        it('#Should be valid is string #success', async function(){
            try {
                const port = await server.getNormalizePort(10);
                expect(port).to.exist;
            } catch (error) {
                expect(error).to.not.throw();
            }
        })

        it('#Should be invalid if the param at value NaN #error', async function(){
            try {
                const port = await server.getNormalizePort(0 / 0);
                expect(port).to.exist;
            } catch (error) {
                expect(error).to.not.throw();
            }
        })

        it('#Should be invalid if the param is empty #error', async function(){
            try {
                const port = await server.getNormalizePort();
                expect(port).to.not.exist;
            } catch (error) {
                expect(error).to.exist;
            }
        })
    });


})