import os, sys, traceback

#-_-_-_-_-_-Global Variables-_-_-_-_-_-#
clear_cmd = None
#-_-_-_-_-_-Global Variables-_-_-_-_-_-#


middleware_template = '''const express = require("express");

//------------------------DO NOT MESH WITH THIS CODE------------------------//
/**
 * 
 * @param {number} level 
 * @param {string} name 
 * @returns { {level: number, name: string, func: *, app: express.Application} }
 */
function Middleware(level, name) 
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
const middle = Middleware(%order%, "%name%");




/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const %name% = (req, res, next)=>
{
    //Thi is where your code goes!!!!
    res.send("%name% Works!!!");
    console.log("%name% Works!!!");
};




//DO NOT MESH WITH THIS CODE.
middle.func     = %name%;
module.exports  = middle;'''




router_template = '''const express   = require("express");

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
        router: express.Router(),
        app   : null
    };
}

//Use router.router to access the express router.
const router = Router("%name%");
//------------------------DO NOT MESH WITH THIS CODE------------------------//



//---------------------This is where your code goes---------------------//

router.router.get("/%name%", (req, res)=>
{
    res.send("GET /%name% is working!");
});

//---------------------This is where your code goes---------------------//



//DO NOT MESH WITH THIS CODE.
module.exports  = router;'''



#============================Main Menu============================#
def main():
    
    while True:

        #Clear the screen.
        os.system(clear_cmd)

        #Print the menu.
        print("==========Skyend (Main Menu)==========")
        print("1) New Middleware")
        print("2) New Router")
        print("3) Quit")
        print("==========Skyend (Main Menu)==========")

        #Get user input.
        choice = input(">>> ")

        #Create new Middleware.
        if choice == "1":
            createMiddleware()
        
        #Create new Router.
        elif choice == "2":
            createRouter()
        
        #Exit the program.
        elif choice == "3" or choice == "quit" or choice == "exit":
            return
        
        #Uknown input, continue.
        else:
            continue
#============================Main Menu============================#




#========================Create Middleware========================#
def createMiddleware():

    #Clear the screen.
    os.system(clear_cmd)

    #Get the name/path relative to the src/middleware directory.
    path  = input("Middleware name: ")
    order = input("Load Order     : ")

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
            file.write(middleware_template.replace("%name%", basename).replace("%order%", order))
        
        #Print a success message.
        print("\nMiddleware:", actual_path, ", was created!!!")
        input("Press ENTER to continue...")


    #Permission Error.
    except PermissionError:
        print("Middleware:'", actual_path, "' creation failed.")
        print("Reason    : Permission Denied.")
        print("Tip       : Make sure Skyend project has the appropriate file permissions.\n")
        input("Press ENTER to continue...")

    #File Not Found Error.
    except FileNotFoundError:
        print("Middleware:'", actual_path, "' creation failed.")
        print("Reason    : Invalid name.")
        print("Tip       : Make sure the name is an appropriate file path.\n")
        input("Press ENTER to continue...")

    #Uknown Error.
    except Exception:
        print("Middleware:'", actual_path, "' creation failed.")
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
        print("Router:'", actual_path, "' creation failed.")
        print("Reason    : Permission Denied.")
        print("Tip       : Make sure Skyend project has the appropriate file permissions.\n")
        input("Press ENTER to continue...")

    #File Not Found Error.
    except FileNotFoundError:
        print("Router:'", actual_path, "' creation failed.")
        print("Reason    : Invalid name.")
        print("Tip       : Make sure the name is an appropriate file path.\n")
        input("Press ENTER to continue...")

    #Uknown Error.
    except Exception:
        print("Router:'", actual_path, "' creation failed.")
        print("Reason    : Uknown.")
        print("Tip       : Report this as a bug.\n")
        print("Stack     :", traceback.format_exc())
        input("Press ENTER to continue...")
#==========================Create Router==========================#




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
