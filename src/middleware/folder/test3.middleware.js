
const middleware = require(process.cwd() + "/skyend/middleware");

//Create the middleware object.
const middle = middleware(-1, "test3");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const test3 = (req, res, next)=>
{
    res.send("test3 Works!!!");
    console.log("test3 Works!!!");
};




//DO NOT MESH WITH THIS CODE.
middle.func     = test3;
module.exports  = middle;
