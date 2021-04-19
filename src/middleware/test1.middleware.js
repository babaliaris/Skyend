
const middleware = require(process.cwd() + "/skyend/middleware");

//Create the middleware object.
const middle = middleware(1, "test1");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const test1 = (req, res, next)=>
{
    res.send("test1 Works!!!");
    console.log("test1 Works!!!");
};




//DO NOT MESH WITH THIS CODE.
middle.func     = test1;
module.exports  = middle;
