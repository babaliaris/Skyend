//################### Require ###################//
const express   = require("express");
const walkdir   = require("walkdir");
const dotenv    = require("dotenv");
//################### Require ###################//


//Create the Express App.
const app = express();

//Load the environment variables.
dotenv.config();

//-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//
const MIDDLEWARE = [];
//-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//


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

//===================Load All The Middleware Scripts===================//




//=====================Load All The Route Scripts=====================//
walkdir.sync("./src/routes", (path, stat)=>
{
    //If the path is a javascript file.
    if (stat.isFile() && path.includes(".js"))
    {
        //Require the Route script.
        const route = require(path);
        
        //Usese it in the app.
        app.use(route);
    }
});
//=====================Load All The Route Scripts=====================//



//Uncaught Errors Handler.
process.on("uncaughtException", (err)=>
{
    console.log(err.stack);
});



//Start the APP.
app.listen(process.env.PORT, ()=>
{
    console.log("Skyend is now Listening in port: "+process.env.PORT);
});