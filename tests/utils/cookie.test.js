const chai = require('chai');
const rewire = require('rewire');
const chalk = require('chalk');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

//Use that for a function without export
const logger = rewire('../../dist/utils/cookie');
const getCookie = logger.__get__('getCookie');
const getCookieXsrfToken = logger.__get__('getCookieXsrfToken');
const getCookieRefreshToken = logger.__get__('getCookieRefreshToken');

describe('UTILS COOKIE', function() {

    describe('#xUnit: getCookie', function() {
        it('#Should be valid if it return right information #success ', function(){
            const cookieName = "cookie";
            const cookieValue = "test";
            const cookieExpire = 1800;

            const infos = getCookie(cookieName, cookieValue, cookieExpire);

            expect(Object.keys(infos), "lengthOf error").to.have.lengthOf(3)
            expect(infos, "name error").to.have.deep.property('name', cookieName);
            expect(infos, "value error").to.have.deep.property('value', cookieValue);
            expect(infos, "options error").to.have.deep.property('options');

            expect(Object.keys(infos.options)).to.have.lengthOf(4);
            expect(infos.options, "options httpOnly error").to.have.deep.property('httpOnly', false);
            expect(infos.options, "options domain error").to.have.deep.property('domain', 'localhost');
            expect(infos.options, "options secure error").to.have.deep.property('secure', false);
            expect(infos.options, "options maxAge error").to.have.deep.property('maxAge', 1800000);
        });
    });

    describe('#xUnit: getCookieXsrfToken', function() {
        it('#Should be valid if it return right information #success ', function(){
            const cookieValue = "xrfToken";
            const cookieExpire = 2000;

            const infos = getCookieXsrfToken(cookieValue, cookieExpire);

            expect(Object.keys(infos), "lengthOf error").to.have.lengthOf(3)
            expect(infos, "name error").to.have.deep.property('name', "app_xsrftoken");
            expect(infos, "value error").to.have.deep.property('value', cookieValue);
            expect(infos, "options error").to.have.deep.property('options');

            expect(Object.keys(infos.options)).to.have.lengthOf(4);
            expect(infos.options, "options httpOnly error").to.have.deep.property('httpOnly', false);
            expect(infos.options, "options domain error").to.have.deep.property('domain', 'localhost');
            expect(infos.options, "options secure error").to.have.deep.property('secure', false);
            expect(infos.options, "options maxAge error").to.have.deep.property('maxAge', 2000000);
        });
    });

    describe('#xUnit: getCookieRefreshToken', function() {
        it('#Should be valid if it return right information #success ', function(){
            const cookieValue = "refresh";
            const cookieExpire = 1000;

            const infos = getCookieRefreshToken(cookieValue, cookieExpire);

            expect(Object.keys(infos), "lengthOf error").to.have.lengthOf(3)
            expect(infos, "name error").to.have.deep.property('name', 'app_refrestoken');
            expect(infos, "value error").to.have.deep.property('value', cookieValue);
            expect(infos, "options error").to.have.deep.property('options');

            expect(Object.keys(infos.options)).to.have.lengthOf(4);
            expect(infos.options, "options httpOnly error").to.have.deep.property('httpOnly', false);
            expect(infos.options, "options domain error").to.have.deep.property('domain', 'localhost');
            expect(infos.options, "options secure error").to.have.deep.property('secure', false);
            expect(infos.options, "options maxAge error").to.have.deep.property('maxAge', 1000000);
        });
    });
    
});