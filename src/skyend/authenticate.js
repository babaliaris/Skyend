const jsonWebToken = require("jsonwebtoken");



/**
 * @description This class contains methods to deal with authentication mechanisms.
 * THIS CLASS SHOULD NOT CONTAIN ANY MEMBERS OTHER THAN METHODS!!! ONLY ONE INSTANCE
 * OF THIS CLASS IS GENERATED.
 */
class Authenticate
{
    /**
     * 
     * @param {string} token The token to be verified.
     * @return {Promise} The promise resolves(payload).
     */
    validateToken = (token)=>
    {

        //Create the Promise.
        return new Promise((resolve, reject)=>
        {

            //Verify the token.
            jsonWebToken.verify(token, process.env.JSON_TOKEN_SECRET, (err, payload)=>
            {
                
                //Verification Failed.
                if (err)
                    reject(err);

                //Resolve the payload.
                else
                    resolve(payload);
            });

        });
    };



    /**
     * 
     * @param {object} payload The payload.
     * @param {string} expiration Expiration time. Examples: 60m, 60s, 1d, 1h
     * @return {Promise} The promise resolves(token).
     */
    createToken = (payload, expiration)=>
    {
        //Create the Promise.
        return new Promise((resolve, reject)=>
        {
            //Sign and Create the token.
            jsonWebToken.sign(payload, process.env.JSON_TOKEN_SECRET, {"expiresIn": expiration}, (err, token)=>
            {

                //Reject the error.
                if (err)
                    reject(err);

                //Resolve the token.
                else
                    resolve(token);
            });

        });
    };
}


//Export a single instance of this class.
module.exports = new Authenticate();