const express   = require("express");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {string} name 
 * @returns { {name: string, router: express.Router, app: express.Application} }
 */
function Router(name) 
{
    return {
        name  : name,
        router : express.Router(),
        app   : null
    };
}

//Use router.router to access the express router.
const router = Router("test");
//------------------------DO NOT MESH WITH THIS CODE------------------------//



//---------------------This is where your code goes---------------------//

router.router.get("/test", (req, res)=>
{
    res.send("GET /test is working!");
});

//---------------------This is where your code goes---------------------//



//DO NOT MESH WITH THIS CODE.
module.exports  = router;