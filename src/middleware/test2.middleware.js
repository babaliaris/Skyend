
const middleware = require(process.cwd() + "/skyend/middleware");

//Create the middleware object.
const middle = middleware(2, "test2");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const test2 = (req, res, next)=>
{
    res.send("test2 Works!!!");
    console.log("test2 Works!!!");
};




//DO NOT MESH WITH THIS CODE.
middle.func     = test2;
module.exports  = middle;
