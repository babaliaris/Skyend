
const middleware = require(process.cwd() + "/skyend/middleware");

//Create the middleware object.
const middle = middleware(0, "test");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const test = (req, res, next)=>
{
    res.send("test Works!!!");
    console.log("test Works!!!");
};




//DO NOT MESH WITH THIS CODE.
middle.func     = test;
module.exports  = middle;