const chai = require('chai');
const rewire = require('rewire');
const chalk = require('chalk');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

//Use that for a function without export
const logger = rewire('../../dist/utils/logger');
const useChalk = logger.__get__('useChalk');
const errorLog = logger.__get__('errorLog');
const infoLog = logger.__get__('infoLog');

describe('UTILS LOGGER', function() {

    describe('#xUnit: useChalk', function() {
        it('#Should be valid if all message are return #success ', function(){
            const successMessage = useChalk("This a message", "success");
            expect(successMessage, 'success message').to.equal(chalk.green("This a message"));
            const errorMessage = useChalk("This a message", "error");
            expect(errorMessage, 'error message').to.equal(chalk.red("This a message"));
            const generalMessage = useChalk("This a message");
            expect(generalMessage, 'general message').to.equal(chalk.yellow("This a message"));
        });
    });

    describe('#xUnit: errorLog', function() {
        it('#Should be valid if the message is return #success ', function(){
            const message = errorLog("Error message");
            expect(message).to.equal("Error message");
        });
    });

    describe('#xUnit: infoLog', function() {
        it('#Should be valid if the message is return #success ', function(){
            const message = infoLog("Info message");
            expect(message).to.equal("Info message");
        });
    });
    
});