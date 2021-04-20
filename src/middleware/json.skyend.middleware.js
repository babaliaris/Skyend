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
const middle = Middleware(1, "json");




/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const json = express.json();




//DO NOT MESH WITH THIS CODE.
middle.func     = json;
module.exports  = middle;