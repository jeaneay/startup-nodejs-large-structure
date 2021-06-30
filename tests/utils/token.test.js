const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const token = require('../../dist/utils/token');

chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

describe('UTILS TOKEN', function() {

    describe('#xUnit: createXsrfToken', function() {
        it('#Should be valid #success', async function(){
            try {
                const xsrfToken = await token.createXsrfToken();
                expect(xsrfToken).to.exist;
            } catch (error) {
                expect(error).to.not.throw();
            }
        })
    });

    describe('#xUnit: createToken', function() {

        it('#Should be valid if the user at 2 properties (id, email) #success.', async function(){
            try {
                const user = {
                    id: 2,
                    email: 'user@example.com',
                };
                const datas = await token.createToken(user);
                //Check token informations
                expect(datas).to.exist;
                expect(Object.keys(datas)).to.have.lengthOf(2);
                expect(datas, '"xsrfToken" information is not wrong.').to.have.deep.property("xsrfToken", datas.xsrfToken);
                expect(datas, '"accessToken" information is not wrong.').to.have.deep.property("accessToken", datas.accessToken);
            } catch (error) {
                expect(error).to.not.throw();
            }
        });

        it('#Should be invalid if the user required properties (id, email) are empty #error.', async function(){
            try {
                (await token.createToken()).should.be.rejected;
            } catch (errors) {
                expect(errors).to.exist;
            }
        })
    });

    describe('#xUnit: getInfosToAccessToken', function() {

        before("Initialize user and token infos", async function() {
            this.user = {
                id: 1,
                email: 'test@test.com',
                firstName: 'John',
            };
            this.tokens = await token.createToken(this.user);
        });

        it('#Should be valid if we create and retrieve token from user #success.', async function(){
            try {
                const infos = await token.getInfosToAccessToken(this.tokens.accessToken);
                //Check token informations
                expect(infos).to.exist;
                // list keys : id, email, xsrfToken and keys from jwt iat, exp
                expect(Object.keys(infos)).to.have.lengthOf(5);
                expect(infos, '"id" information is not wrong.').to.have.deep.property("id", this.user.id);
                expect(infos, '"email" information is not wrong.').to.have.deep.property("email", this.user.email);
                expect(infos, '"xsrfToken" information is not wrong.').to.have.deep.property("xsrfToken", this.tokens.xsrfToken);
            } catch (error) {
                expect(error).to.not.throw();
            }
        });

        it('#Should be invalid if we send bad token #error.', async function(){
            try {
                const tokenName = "token";
                (await token.getInfosToAccessToken(tokenName)).should.be.rejected;
            } catch (error) {
                expect(error).to.exist;
            }
        });

        it('#Should be invalid if we send no token #error.', async function(){
            try {
                (await token.getInfosToAccessToken()).should.be.rejected;
            } catch (error) {
                expect(error).to.exist;
            }
        });
    });

    describe('#xUnit: createRefreshToken', function() {

        it('#Should be valid if the user required properties (id, email) are not empty #success.', async function(){
            try {
                const user = {
                    id: 2,
                    email: 'user@example.com',
                };
                const refreshToken = await token.createRefreshToken(user);
                //Check token informations
                expect(refreshToken).to.exist;
            } catch (error) {
                expect(error).to.not.throw();
            }
        })
    
        it('#Should be invalid if the user required properties (id, email) are empty #error.', async function(){
            try {
                (await token.createRefreshToken()).should.be.rejected;
            } catch (errors) {
                expect(errors).to.exist;
            }
        })
    });

    describe('#xUnit: getRefreshToken', function() {

        before("Create token", async function() {
            this.user = {
                id: 5,
                email: 'user@example.com',
            };
            this.refreshToken = await token.createRefreshToken(this.user);
        })

        it('#Should be valid if it return properties from user #success.', async function(){
            try {
                const infos = await token.getRefreshToken(this.refreshToken);
                //Check token informations
                expect(infos).to.exist;
                // list keys : id, email and keys from jwt iat, exp
                expect(Object.keys(infos)).to.have.lengthOf(4);
                expect(infos, '"id" information is not wrong.').to.have.deep.property("id", this.user.id);
                expect(infos, '"email" information is not wrong.').to.have.deep.property("email", this.user.email);

            } catch (error) {
                expect(error).to.not.throw();
            }
        })

        it('#Should be invalid if the token property not exist #error.', async function(){
            try {
                (await token.getRefreshToken()).should.be.rejected;
            } catch (errors) {
                expect(errors).to.exist;
            }
        })
    });

    describe('#xUnit: createPasswordToken', function() {

        it('#Should be valid if the user required properties (id, email) are not empty #success.', async function(){
            try {
                const user = {
                    id: 2,
                    email: 'user@example.com',
                };
                const resetPasswordToken = await token.createPasswordToken(user);
                //Check token informations
                expect(resetPasswordToken).to.exist;
            } catch (error) {
                expect(error).to.not.throw();
            }
        });

        it('#Should be invalid if the user required properties (id, email) are empty #error.', async function(){
            try {
                (await token.createPasswordToken()).should.be.rejected;
            } catch (errors) {
                expect(errors).to.exist;
            }
        })
    });

    describe('#xUnit: getPasswordToken', function() {

        before("Initialize user and token infos", async function() {
            this.user = {
                id: 1,
                email: 'test@test.com',
                firstName: 'John',
            };
            this.tokenPassword = await token.createPasswordToken(this.user);
        });

        it('#Should be valid if we create and retrieve token from user #success.', async function(){
            try {
                const infos = await token.getPasswordToken(this.tokenPassword);
                //Check token informations
                expect(infos).to.exist;
                // list keys : id, email and keys from jwt iat, exp
                expect(Object.keys(infos)).to.have.lengthOf(4);
                expect(infos, '"id" information is not wrong.').to.have.deep.property("id", this.user.id);
                expect(infos, '"email" information is not wrong.').to.have.deep.property("email", this.user.email);
            } catch (error) {
                expect(error).to.not.throw();
            }
        });

        it('#Should be invalid if we send bad token #error.', async function(){
            try {
                const tokenName = "token";
                (await token.getPasswordToken(tokenName)).should.be.rejected;
            } catch (error) {
                expect(error).to.exist;
            }
        });

        it('#Should be invalid if we send no token #error.', async function(){
            try {
                (await token.getPasswordToken()).should.be.rejected;
            } catch (error) {
                expect(error).to.exist;
            }
        });
    });

})