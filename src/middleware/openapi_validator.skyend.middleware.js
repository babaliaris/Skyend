const express   = require("express");
const validator = require("express-openapi-validator");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: express.Application} }
 */
function Middleware(level, name) 
{
    return {
        level   : level,
        name    : name,
        func    : null,
        app     : null
    };
}
//------------------------DO NOT MESH WITH THIS CODE------------------------//

//Create the middleware object.
const middle = Middleware(2, "openapi_validator");




/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
let openapi_validator = validator.middleware({
    apiSpec: './api.yaml',
    validateRequests: true,
    validateResponses: true
});




//****************************************************************************//
//****************************************************************************//
//****************************************************************************//
//************REMOVE THIS IF YOU WANT TO ENABLE OPEN API VALIDATOR************//

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
openapi_validator = (req, res, next)=>
 {
    next();
 };
//************REMOVE THIS IF YOU WANT TO ENABLE OPEN API VALIDATOR************//
//****************************************************************************//
//****************************************************************************//
//****************************************************************************//





//DO NOT MESH WITH THIS CODE.
middle.func     = openapi_validator;
module.exports  = middle;