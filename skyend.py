import os, sys, traceback

#-_-_-_-_-_-Global Variables-_-_-_-_-_-#
clear_cmd = None
#-_-_-_-_-_-Global Variables-_-_-_-_-_-#


middleware_template = '''const __express__ = require("express");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: __express__.Application} }
 */
function __Middleware__(level, name) 
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
const __middle__ = __Middleware__(%order%, "%name%");




/**
 * 
 * @param {__express__.Request} req 
 * @param {__express__.Response} res 
 * @param {__express__.NextFunction} next 
 */
const %name% = (req, res, next)=>
{
    //Thi is where your code goes!!!!
    res.send("%name% Works!!!");
    console.log("%name% Works!!!");
};




//DO NOT MESH WITH THIS CODE.
__middle__.func = %name%;
module.exports  = __middle__;'''




router_template = '''const __express__   = require("express");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {string} name 
 * @returns { {name: string, router: __express__.Router, app: __express__.Application} }
 */
function __Router__(name) 
{
    return {
        name  : name,
        router: __express__.Router(),
        app   : null
    };
}

//Use __router__.router to access the express router.
const __router__ = __Router__("%name%");
//------------------------DO NOT MESH WITH THIS CODE------------------------//



//---------------------This is where your code goes---------------------//

__router__.router.get("/%name%", (req, res)=>
{
    res.send("GET /%name% is working!");
});

//---------------------This is where your code goes---------------------//



//DO NOT MESH WITH THIS CODE.
module.exports  = __router__;'''



startup_template = '''//Import express.js
const __express__ = require("express");

/**
 * 
 * @param {__express__.Application} app 
 * @return {void}
 */
const %name% = (app)=>
{
    console.log("%name% script works!!!");
};


//Export the function.
module.exports = %name%;'''



public_middleware_template = '''const __express__ = require("express");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: __express__.Application} }
 */
function __Middleware__(level, name) 
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
const __middle__ = __Middleware__(%order%, "%name%");




/**
 * 
 * @param {__express__.Request} req 
 * @param {__express__.Response} res 
 * @param {__express__.NextFunction} next 
 */
const %name% = __express__.static("./public");




//DO NOT MESH WITH THIS CODE.
__middle__.func = %name%;
module.exports  = __middle__;'''




json_middleware_template = '''const __express__ = require("express");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: __express__.Application} }
 */
function __Middleware__(level, name) 
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
const __middle__ = __Middleware__(%order%, "%name%");




/**
 * 
 * @param {__express__.Request} req 
 * @param {__express__.Response} res 
 * @param {__express__.NextFunction} next 
 */
const %name% = __express__.json();




//DO NOT MESH WITH THIS CODE.
__middle__.func = %name%;
module.exports  = __middle__;'''




openapi_validator_middleware_template = '''const __express__   = require("express");
const __validator__ = require("express-openapi-validator");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: __express__.Application} }
 */
function __Middleware__(level, name) 
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
const __middle__ = __Middleware__(%order%, "%name%");




/**
 * 
 * @param {__express__.Request} req 
 * @param {__express__.Response} res 
 * @param {__express__.NextFunction} next 
 */
const %name% = __validator__.middleware({
    apiSpec: './api.yaml',
    validateRequests: true,
    validateResponses: true
});



//DO NOT MESH WITH THIS CODE.
__middle__.func = %name%;
module.exports  = __middle__;'''





xss_middleware_template = '''const __express__   = require("express");
const __xss__           = require("xss");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: __express__.Application} }
 */
function __Middleware__(level, name) 
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
const __middle__ = __Middleware__(2, "%name%");




/**
 * 
 * @param {__express__.Request} req 
 * @param {__express__.Response} res 
 * @param {__express__.NextFunction} next 
 */
const %name% = (req, res, next)=>
{
    //Filter body params.
    for (key in req.body)
    {
        req.body[key] = __xss__(req.body[key]);
    }

    //Filter query params.
    for (key in req.params)
    {
        req.params[key] = __xss__(req.params[key]);
    }

    //Next middleware.
    next();
};




//DO NOT MESH WITH THIS CODE.
__middle__.func = %name%;
module.exports  = __middle__;'''




#============================Main Menu============================#
def main():
    
    while True:

        #Clear the screen.
        os.system(clear_cmd)

        #Print the menu.
        print("==========Skyend (Main Menu)==========")
        print("1) New Middleware")
        print("2) New Router")
        print("3) New StartUp")
        print("4) Quit")
        print("==========Skyend (Main Menu)==========")

        #Get user input.
        choice = input(">>> ")

        #Create new Middleware.
        if choice == "1":
            createMiddleware()
        
        #Create new Router.
        elif choice == "2":
            createRouter()

        #Create new StartUp.
        elif choice == "3":
            createStartup()
        
        #Exit the program.
        elif choice == "4" or choice == "quit" or choice == "exit":
            return
        
        #Uknown input, continue.
        else:
            continue
#============================Main Menu============================#




#========================Create Middleware========================#
def createMiddleware():

    #Some Variables.
    template     = ""
    choosen_info = "\nMiddleware name"

    while True:

        #Clear the screen.
        os.system(clear_cmd)

        #Print the menu.
        print("=======Skyend (Middleware Menu)=======")
        print("1)  New Middleware")
        print("2) (Template) Express.public()")
        print("3) (Template) Express.json()")
        print("4) (Template) Open API Validator")
        print("5) (Template) XSS Middleware")
        print("6)  Back to main menu")
        print("=======Skyend (Middleware Menu)=======")

        #Get user input.
        choice = input(">>> ")

        #Create new Middleware.
        if choice == "1":
            template = middleware_template
            break
        
        #Create new express.public() middleware.
        elif choice == "2":
            template = public_middleware_template
            choosen_info = choosen_info + " ( Template Express.public() )"
            break

        #Create new express.json() middleware.
        elif choice == "3":
            template = json_middleware_template
            choosen_info = choosen_info + " ( Template Express.json() )"
            break

        #Create new open api validator middleware.
        elif choice == "4":
            template = openapi_validator_middleware_template
            choosen_info = choosen_info + " ( Template Open API Validator )"
            break


        #Create XSS Middleware.
        elif choice == "5":
            template = xss_middleware_template
            choosen_info = choosen_info + " ( Template XSS Middleware )"
            break
        
        #Return to the main menu..
        elif choice == "6" or choice == "back" or choice == "return":
            return
        
        #Uknown input, continue.
        else:
            continue

    #Get the name/path relative to the src/middleware directory.
    choosen_info    = choosen_info + ": "
    path            = input(choosen_info)
    order           = input("Load Order: ")

    #Split the filename and the extension.
    filename, file_extension = os.path.splitext(path)
    
    #Get the basename of the path witout the extension.
    basename = os.path.basename(filename)

    #Keep only the first string if there are dots in the name.
    basename = basename.split(".")[0]

    #Change the path to contain the filename + .middleware.
    path = filename + file_extension + ".middleware.js"

    #Create the actual path.
    actual_path = os.path.join("src", os.path.join("middleware", path))

    #Create the script file.
    try:

        #Check if order is a number.
        int(order)

        #Create the directories first.
        os.makedirs(os.path.dirname(actual_path), exist_ok=True)

        #Ask to ovveride a file.
        if os.path.exists(actual_path):

            #Ask the user what to do.
            choice = input("The middleware: '"+actual_path+"' already exists. Do you want to ovewrite it? (yes, no): ")

            #Ovveride the file.
            if choice == "yes" or choice == "y": 
                pass

            #Abord.
            else: 
                return

        #Create and write the file.
        with open(actual_path, "w") as file:
            file.write(template.replace("%name%", basename).replace("%order%", order))
            
        

        #Print a success message.
        print("\nMiddleware:", actual_path, ", was created!!!")
        input("Press ENTER to continue...")
        return


    #Permission Error.
    except PermissionError:
        print("\n\nMiddleware:'", actual_path, "' creation failed.")
        print("Reason    : Permission Denied.")
        print("Tip       : Make sure Skyend project has the appropriate file permissions.\n")
        input("Press ENTER to continue...")

    #File Not Found Error.
    except FileNotFoundError:
        print("\n\nMiddleware:'", actual_path, "' creation failed.")
        print("Reason    : Invalid name.")
        print("Tip       : Make sure the name is an appropriate file path.\n")
        input("Press ENTER to continue...")

    #File Not Found Error.
    except ValueError:
        print("\n\nMiddleware:'", actual_path, "' creation failed.")
        print("Reason    : Invalid order.")
        print("Tip       : Make sure the order is an integer number.\n")
        input("Press ENTER to continue...")

    #Uknown Error.
    except Exception:
        print("\n\nMiddleware:'", actual_path, "' creation failed.")
        print("Reason    : Uknown.")
        print("Tip       : Report this as a bug.\n")
        print("Stack     :", traceback.format_exc())
        input("Press ENTER to continue...")
#========================Create Middleware========================#





#==========================Create Router==========================#
def createRouter():

    #Clear the screen.
    os.system(clear_cmd)

    #Get the name/path relative to the src/routes directory.
    path  = input("Router name: ")

    #Split the filename and the extension.
    filename, file_extension = os.path.splitext(path)
    
    #Get the basename of the path witout the extension.
    basename = os.path.basename(filename)

    #Keep only the first string if there are dots in the name.
    basename = basename.split(".")[0]

    #Change the path to contain the filename + .router.
    path = filename + file_extension + ".router.js"

    #Create the actual path.
    actual_path = os.path.join("src", os.path.join("routers", path))

    #Create the script file.
    try:

        #Create the directories first.
        os.makedirs(os.path.dirname(actual_path), exist_ok=True)

        #Ask to ovveride a file.
        if os.path.exists(actual_path):

            #Ask the user what to do.
            choice = input("The router: '"+actual_path+"' already exists. Do you want to ovewrite it? (yes, no): ")

            #Ovveride the file.
            if choice == "yes" or choice == "y": 
                pass

            #Abord.
            else: 
                return

        #Create and write the file.
        with open(actual_path, "w") as file:
            file.write(router_template.replace("%name%", basename))
        
        #Print success message.
        print("\nRouter:", actual_path, ", was created!!!")
        input("Press ENTER to continue...")


    #Permission Error.
    except PermissionError:
        print("\n\nRouter:'", actual_path, "' creation failed.")
        print("Reason    : Permission Denied.")
        print("Tip       : Make sure Skyend project has the appropriate file permissions.\n")
        input("Press ENTER to continue...")

    #File Not Found Error.
    except FileNotFoundError:
        print("\n\nRouter:'", actual_path, "' creation failed.")
        print("Reason    : Invalid name.")
        print("Tip       : Make sure the name is an appropriate file path.\n")
        input("Press ENTER to continue...")

    #Uknown Error.
    except Exception:
        print("\n\nRouter:'", actual_path, "' creation failed.")
        print("Reason    : Uknown.")
        print("Tip       : Report this as a bug.\n")
        print("Stack     :", traceback.format_exc())
        input("Press ENTER to continue...")
#==========================Create Router==========================#




#==========================Create StartUp=========================#
def createStartup():

    #Clear the screen.
    os.system(clear_cmd)

    #Get the name/path relative to the src/startup directory.
    path  = input("StartUp name: ")

    #Split the filename and the extension.
    filename, file_extension = os.path.splitext(path)
    
    #Get the basename of the path witout the extension.
    basename = os.path.basename(filename)

    #Keep only the first string if there are dots in the name.
    basename = basename.split(".")[0]

    #Change the path to contain the filename + .startup.
    path = filename + file_extension + ".startup.js"

    #Create the actual path.
    actual_path = os.path.join("src", os.path.join("startup", path))

    #Create the script file.
    try:

        #Create the directories first.
        os.makedirs(os.path.dirname(actual_path), exist_ok=True)

        #Ask to ovveride a file.
        if os.path.exists(actual_path):

            #Ask the user what to do.
            choice = input("The StartUp: '"+actual_path+"' already exists. Do you want to ovewrite it? (yes, no): ")

            #Ovveride the file.
            if choice == "yes" or choice == "y": 
                pass

            #Abord.
            else: 
                return

        #Create and write the file.
        with open(actual_path, "w") as file:
            file.write(startup_template.replace("%name%", basename))
        
        #Print success message.
        print("\nStartUp:", actual_path, ", was created!!!")
        input("Press ENTER to continue...")


    #Permission Error.
    except PermissionError:
        print("\n\nStartUp:'", actual_path, "' creation failed.")
        print("Reason    : Permission Denied.")
        print("Tip       : Make sure Skyend project has the appropriate file permissions.\n")
        input("Press ENTER to continue...")

    #File Not Found Error.
    except FileNotFoundError:
        print("\n\nStartUp:'", actual_path, "' creation failed.")
        print("Reason    : Invalid name.")
        print("Tip       : Make sure the name is an appropriate file path.\n")
        input("Press ENTER to continue...")

    #Uknown Error.
    except Exception:
        print("\n\nStartUp:'", actual_path, "' creation failed.")
        print("Reason    : Uknown.")
        print("Tip       : Report this as a bug.\n")
        print("Stack     :", traceback.format_exc())
        input("Press ENTER to continue...")
#==========================Create StartUp=========================#



#Call Entry Point.
if __name__ == "__main__":

    #Platform is Windows.
    if sys.platform == "win32":
        clear_cmd = "cls"

    #Platform is Linux.
    else:
        clear_cmd = "clear"

    #Call Main Function.
    main()
