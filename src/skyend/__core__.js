//################### Require ###################//
const express   = require("express");
const http      = require("http");
const walkdir   = require("walkdir");
const dotenv    = require("dotenv");
const logger    = require("./logger");
//################### Require ###################//





/**
 * @description The entry point of Skyend.
 * @param {Mocha.Done} done The Mocha Done() function.
 * @returns {http.Server}
 */
const skyend = (done)=>
{
    //-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//
    let MIDDLEWARE        = [];
    let LAST_REQUEST_PATH = "";
    //-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//


    //Uncaught Errors Handler.
    process.on("uncaughtException", (err)=>
    {
        logger.error(err, LAST_REQUEST_PATH);
    });


    //Unhandled Promise Rejections.
    process.on("unhandledRejection", (err)=>
    {
        logger.error(err, LAST_REQUEST_PATH);
    });


    //Create the Express App.
    const app = express();

    //Load the environment variables.
    const dote_env_results = dotenv.config();

    //If .env was not found or not loaded for any reason
    //then throw an error and stop the application.
    if (dote_env_results.error)
        throw dote_env_results.error;

    //----------------Basic MUST HAVE middlewares----------------//

    //Set the LAST_REQUEST_PATH.
    app.use((req, res, next)=>
    {
        //Set the LAST_REQUEST_PATH.
        LAST_REQUEST_PATH = req.path;
        next();
    });

    //----------------Basic MUST HAVE middlewares----------------//



    //Require all the startup Scripts.
    walkdir.sync("./src/startup", (path, stat)=>
    {
        //If the path is a javascript file.
        if (stat.isFile() && path.includes(".js"))
        {
            //Require the startup script.
            const start_up_script = require(path);

            //Run the startup script.
            start_up_script(app);
        }
    });




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

            //Open api Validator Error Detected! Sent it to the client!!!
            if (err.errors && err.errors.length > 0 && err.errors[0].path)
            {
                //JUST A FLAG.
                let is_respsonse_error = false;

                //Check for response errors (RESPONSES ERRORS SHOULD ONLY BE LOGGED).
                err.errors.forEach((val)=>
                {
                    //This is a response error.
                    if ( val.path.includes(".response") )
                    {
                        logger.error(err, req.path);
                        is_respsonse_error = true;
                        res.status(500).json({m_message: "Internal Error"});
                        return;
                    }
                    
                });

                //Send errors.
                if (!is_respsonse_error)
                    res.status(err.status || 500).json(err.errors);
            }

            //Else, send information only if DEVELOPMENT mode is enabled!!!
            else
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
    const server = app.listen(process.env.PORT, ()=>
    {
        //Console some info message.
        console.log("Skyend is now Listening. Port: "+process.env.PORT);

        //Call the Mocha Done() function, if defined.
        if (done) done();
    });

    //Return the http server.
    return server;
};


module.exports = skyend;