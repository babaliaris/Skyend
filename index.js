//################### Require ###################//
const express   = require("express");
const walkdir   = require("walkdir");
//################### Require ###################//


//Create the Express App.
const app = express();


//-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//
//-_-_-_-_-_-_-_-_-_-Global Variables-_-_-_-_-_-_-_-_-_-//



//===================Load All The Middleware Scripts===================//
walkdir.sync("./src/middleware", (path, stat)=>
{
    //If the path is a javascript file.
    if (stat.isFile() && path.includes(".js"))
    {
        //Require the Middleware script.
        const middleware = require(path);
        
        //Usese it in the app.
        app.use(middleware);
    }
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