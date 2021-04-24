const jsonWebToken  = require("jsonwebtoken");
const bcrypt        = require("bcrypt");



/**
 * @description This class contains methods to deal with authentication mechanisms.
 * THIS CLASS SHOULD NOT CONTAIN ANY MEMBERS OTHER THAN METHODS!!! ONLY ONE INSTANCE
 * OF THIS CLASS IS GENERATED.
 * @class
 */
class Authenticate
{
    /**
     * @description Validate a JWT Token.
     * @param {string} token The token to be verified.
     * @return {Promise} The promise resolves(payload).
     */
    validateToken = (token, isRefresh)=>
    {

        //Create the Promise.
        return new Promise((resolve, reject)=>
        {
            //Choose the secret key.
            const secret = isRefresh ? process.env.JSON_REFRESH_SECRET : process.env.JSON_TOKEN_SECRET;

            //Verify the token.
            jsonWebToken.verify(token, secret, (err, payload)=>
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
     * @description Create a JWT Token.
     * @param {object} payload The payload.
     * @param {string} expiration Expiration time. Examples: 60m, 60s, 1d, 1h
     * @return {Promise} The promise resolves(token).
     */
    createToken = (payload, expiration, isRefresh)=>
    {
        //Create the Promise.
        return new Promise((resolve, reject)=>
        {
            //Choose the secret key.
            const secret = isRefresh ? process.env.JSON_REFRESH_SECRET : process.env.JSON_TOKEN_SECRET;

            //Sign and Create the token.
            jsonWebToken.sign(payload, secret, {"expiresIn": expiration}, (err, token)=>
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



    /**
     * @description Create a bcrypt hash.
     * @param {string} password The password to be hashed.
     * @returns {Promise}
     */
    createHash = (password)=>
    {
        //Create the Promise.
        return new Promise((resolve, reject)=>
        {
            //Create the salt.
            bcrypt.genSalt(10, (err, salt)=>
            {

                //Failed to generate the salt.
                if (err)
                    reject(err);

                //Salt generated Successfully!!!
                else
                {

                    //Create the hash.
                    bcrypt.hash(password, salt, (err, hash)=>
                    {

                        //Failed to generate the hash.
                        if (err)
                            reject(err);

                        //Hash created successfully!!!
                        else
                            resolve(hash); 
                    });

                }
            });

        });
    };




    /**
     * @description Validate a bcrypt hash.
     * @param {string} password The password to be verified.
     * @param {string} hash The hash to be compared with the password.
     * @returns {Promise}
     */
    validateHash = (password, hash)=>
    {
        //Create the Promise.
        return new Promise((resolve, reject)=>
        {
            //Compare the password and the hash.
            bcrypt.compare(password, hash, (err, result)=>
            {
                if (err) reject(err);
                else resolve(result);
            });

        });
    };
}


//Export a single instance of this class.
module.exports = new Authenticate();