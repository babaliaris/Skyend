const express = require("express");

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
const middle = Middleware(3, "open_api_err_handler");




/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const open_api_err_handler = (err, req, res, next)=>
{
    res.status(err.status || 500).json({
        message     : err.message,
        specifics   : err.errors
    });
};




//DO NOT MESH WITH THIS CODE.
middle.func     = open_api_err_handler;
module.exports  = middle;