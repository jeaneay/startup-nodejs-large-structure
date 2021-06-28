const chai = require('chai');
const rewire = require('rewire');
const chalk = require('chalk');
const chaiAsPromised = require('chai-as-promised');
const { general, server, sequelize } = require('../../dist/utils/app-messages');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

describe('UTILS APP MESSAGE', function() {

    describe('#xUnit: GENERAL MESSAGE', function() {
        it('#Should be valid if it return right message #success ', function(){
            const errorNotUrl = general.ERROR_NOT_URL("website", "http://example.com");
            expect(errorNotUrl, "errorNotUrl").to.have.equal('This website http://example.com is not an url !');

            const errorValueTooLong = general.ERROR_VALUE_TOO_LONG("name", "john Doe");
            expect(errorValueTooLong, "errorValueTooLong").to.have.equal('This name john Doe is too long !');

            const errorValueTooShort = general.ERROR_VALUE_TOO_SHORT("name", "john");
            expect(errorValueTooShort, "errorValueTooShort").to.have.equal('This name john is too short !');

            const errorValueSize = general.ERROR_VALUE_SIZE("name", 1, 10);
            expect(errorValueSize, "errorValueSize").to.have.equal('The size for name must be between 1 and 10 character !');

            const errorEnumValue = general.ERROR_ENUM_VALUE("city", "paris");
            expect(errorEnumValue, "errorEnumValue").to.have.equal('This city must have one of these values paris !');

            const errorValue = general.ERROR_VALUE("firstName");
            expect(errorValue, "errorValue").to.have.equal('Your firstName is not correct.');

            const errorValueEmpty = general.ERROR_VALUE_EMPTY("name");
            expect(errorValueEmpty, "errorValueEmpty").to.have.equal('This name must be not empty !');

            const errorValueNull = general.ERROR_VALUE_NULL("name");
            expect(errorValueNull, "errorValueNull").to.have.equal('This name must be not null !');

            const errorValueDate = general.ERROR_VALUE_DATE("date");
            expect(errorValueDate, "errorValueDate").to.have.equal('Your date must be a date !');

            const errorValueInteger = general.ERROR_VALUE_INTEGER("test");
            expect(errorValueInteger, "errorValueInteger").to.have.equal('Your test must be a integer !');

            const errorSimpleMessage = general.SIMPLE_ERROR_MESSAGE("lastName");
            expect(errorSimpleMessage, "errorSimpleMessage").to.have.equal('An error is detected with the field lastName verify the value !');
        });
    });

    describe('#xUnit: SERVER MESSAGE', function() {
        it('#Should be valid if it return right message #success ', function(){
            const successRecord = server.SUCCESS_RECORD("name");
            expect(successRecord, "successRecord").to.have.equal('Your name has been recorded !');

            const successDeleteRecord = server.SUCCESS_DELETE_RECORD("name");
            expect(successDeleteRecord, "successDeleteRecord").to.have.equal('This name has been deleted !');

            const successUpdateRecord = server.SUCCESS_UPDATE_RECORD("name");
            expect(successUpdateRecord, "successUpdateRecord").to.have.equal('This name has been modify !');

            const errorSaveRecord = server.ERROR_SAVE_RECORD("city");
            expect(errorSaveRecord, "errorSaveRecord").to.have.equal('Impossible to save this city !');

            const errorDeleteRecord = server.ERROR_DELETE_RECORD("firstName");
            expect(errorDeleteRecord, "errorDeleteRecord").to.have.equal('Cannot delete this firstName check if exist !');

            const errorUpdateRecord = server.ERROR_UPDATE_RECORD("firstName");
            expect(errorUpdateRecord, "errorUpdateRecord").to.have.equal('Cannot modify this firstName !');

            const errorRecordAlreadyExist = server.ERROR_RECORD_ALREADY_EXITS("firstName", "john");
            expect(errorRecordAlreadyExist, "errorRecordAlreadyExist").to.have.equal('This firstName john already exits !');

            const errorBadRight = server.ERROR_BAD_RIGHT("firstName");
            expect(errorBadRight, "errorBadRight").to.have.equal('Access denied. You are not the right firstName !');

            const errorNotExist = server.ERROR_NOT_EXIST("firstName");
            expect(errorNotExist, "errorNotExist").to.have.equal('This firstName does not exist !');

            const errorFileNotFound = server.ERROR_FILE_NOT_FOUND("avatar");
            expect(errorFileNotFound, "errorFileNotFound").to.have.equal('File avatar not found !');
        });
    });

    describe('#xUnit: SEQUELIZE MESSAGE', function() {
        it('#Should be valid if it return right message #success ', function(){
            const serverConnected = sequelize.SERVER_CONNECTED("databaseName");
            expect(serverConnected, "serverConnected").to.have.equal('Postgresql database "databaseName" connection is open !');

            const serverError = sequelize.SERVER_ERROR("databaseName", "Missed params");
            expect(serverError, "serverError").to.have.equal('Postgresql database "databaseName" connection has occured "Missed params" error.');

            const serverDisconnected = sequelize.SERVER_DISCONNECTED("databaseName");
            expect(serverDisconnected, "serverDisconnected").to.have.equal('Postgresql database "databaseName" connection is disconnected.');

            const serverSigint = sequelize.SERVER_SIGINT("databaseName");
            expect(serverSigint, "serverSigint").to.have.equal('Postgresql database "databaseName" connection disconnected through app termination.');

            const errorPropertyNotValid = sequelize.ERROR_PROPERTY_NOT_VALID("name", "john");
            expect(errorPropertyNotValid, "errorPropertyNotValid").to.have.equal('The name john is not valid !');

            const errorPropertyAlreadyExits = sequelize.ERROR_PROPERTY_ALREADY_EXITS("name", "john");
            expect(errorPropertyAlreadyExits, "errorPropertyAlreadyExits").to.have.equal('This name john already exits !');
        });
    });
    
});