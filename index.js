//################### Require ###################//
const express   = require("express");
const walkdir   = require("walkdir");
const dotenv    = require("dotenv");
const logger    = require("./src/skyend/logger");
//################### Require ###################//


//-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//
let MIDDLEWARE        = [];
let LAST_REQUEST_PATH = "";
//-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//


//Uncaught Errors Handler.
process.on("uncaughtException", (err)=>
{
    logger.error(err, LAST_REQUEST_PATH);
    LAST_REQUEST_PATH = ""; //Reset the LAST_REQUEST_PATH.
});


//Unhandled Promise Rejections.
process.on("unhandledRejection", (err)=>
{
    logger.error(err, LAST_REQUEST_PATH);
    LAST_REQUEST_PATH = ""; //Reset the LAST_REQUEST_PATH.
});


//Create the Express App.
const app = express();

//Load the environment variables.
dotenv.config();

//----------------Basic MUST HAVE middlewares----------------//

//Set the LAST_REQUEST_PATH.
app.use((req, res, next)=>
{
    //Set the LAST_REQUEST_PATH.
    LAST_REQUEST_PATH = req.path;
    next();
});

//Public Folder Configuration.
app.use(express.static("./public"));

//JSON converter middleware.
app.use(express.json());

//----------------Basic MUST HAVE middlewares----------------//




//===================Load All The Middleware Scripts===================//

//Require all the middleware scripts and push them into the MIDDLEWARE array.
walkdir.sync("./src/middleware", (path, stat)=>
{
    //If the path is a javascript file.
    if (stat.isFile() && path.includes(".js"))
    {
        //Require the Middleware script.
        const middle = require(path);

        //Set the app object.
        middle.app = app;

        //Push the required middleware into the MIDDLEWARE array.
        MIDDLEWARE.push(middle);
    }
});


//Sort the array using middleware.level property.
MIDDLEWARE.sort((first, second)=>
{
    if (first.level < second.level)
        return -1;

    else if (first.level > second.level)
        return 1;

    return 0;
});


//Use all the middleware in the RIGHT Order.
MIDDLEWARE.forEach((middle)=>
{
    app.use(middle.func);
});

//We don't need this array anymore...
MIDDLEWARE = null;

//===================Load All The Middleware Scripts===================//




//=====================Load All The Route Scripts=====================//
walkdir.sync("./src/routers", (path, stat)=>
{
    //If the path is a javascript file.
    if (stat.isFile() && path.includes(".js"))
    {
        //Require the Route script.
        const router = require(path);

        //Set the app object.
        router.app = app;
        
        //Use it in the app.
        app.use(router.router);
    }
});
//=====================Load All The Route Scripts=====================//




//===================Express Default Error Handler====================//
app.use((err, req, res, next)=>
{
    //Set the status code to INTERNAL ERROR.
    res.statusCode = 500;


    //If there was ineed an error that wansn't handled.
    if (err)
    {
        //Log the error.
        logger.error(err, req.path);

        //If Dev Mode, send the stack trace as the response.
        if (process.env.NODE_ENV !== "production")
            res.send(err.stack);

        //if production mode, just send a simple message.
        else
            res.send("Internal Error!");
    }


    //This code SHOULD NEVER BE REACHED.
    else
    {
        //Create a fake error.
        const fake_error = new Error("Express Default Error Handler: This error should not be triggered!!!");

        //Log the fake error.
        logger.error(fake_error, req.path);

        //If Dev Mode, send the stack trace as the response.
        if (process.env.NODE_ENV !== "production")
            res.send(fake_error.stack);

        //if production mode, just send a simple message.
        else
            res.send("Internal Error!");
    }

});
//===================Express Default Error Handler====================//


//Start the APP.
app.listen(process.env.PORT, ()=>
{
    console.log("Skyend is now Listening in port: "+process.env.PORT);
});