const express = require("express");

/**
 * @callback MiddlewareFunction
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns {void}
 */


/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: MiddlewareFunction, app: express.Application} }
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



 module.exports = Middleware;