const assert    = require("assert");
const auth      = require("../src/skyend/authenticate");
const dotenv    = require("dotenv");

//Create the authenticate suit.
describe("Authenticate", ()=>
{

    //Before ONCE.
    before(()=>
    {
        dotenv.config();
    });

    //Create Token Test.
    it("Create Token", (done)=>
    {
        //Create the token.
        auth.createToken({m_username: "nikos"}, "1m").then((token)=>
        {
            done();

        }).catch((err)=>
        {
            done(err);
        });
    });


    //Validate Token Test.
    it("Validate Token", (done)=>
    {
        //Create the token.
        auth.createToken({m_username: "nikos"}, "1m").then((token)=>
        {
            //Validate the token.
            auth.validateToken(token).then((payload)=>
            {
                //Check the payload m_username.
                assert.strictEqual(payload.m_username, "nikos");

                done();

            }).catch((err)=>
            {
                done(err);
            });

        }).catch((err)=>
        {
            done(err);
        });
    });


    //Token Expired Test.
    it("Token Expired", (done)=>
    {

        //Create a timeout callback.
        const timeoutCallback = (token)=>
        {
            //Validate the token.
            auth.validateToken(token).then((payload)=>
            {
                done(new Error("This should fail to validate!"));
                
            }).catch((err)=>
            {
                done();
            });
        };


        //Create the token (EXPIRES IN: 1 SECOND).
        auth.createToken({m_username: "nikos"}, "1ms").then((token)=>
        {
            setTimeout(timeoutCallback, 2, token);

        }).catch((err)=>
        {
            done(err);
        });
    });

});