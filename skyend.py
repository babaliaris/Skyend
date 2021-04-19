import os, sys, traceback

#-_-_-_-_-_-Global Variables-_-_-_-_-_-#
clear_cmd = None
#-_-_-_-_-_-Global Variables-_-_-_-_-_-#


middleware_template = '''
const middleware = require(process.cwd() + "/skyend/middleware");

//Create the middleware object.
const middle = middleware(%order%, "%name%");

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const %name% = (req, res, next)=>
{
    res.send("%name% Works!!!");
    console.log("%name% Works!!!");
};




//DO NOT MESH WITH THIS CODE.
middle.func     = %name%;
module.exports  = middle;
'''



#============================Main Menu============================#
def main():
    
    while True:

        #Clear the screen.
        os.system(clear_cmd)

        #Print the menu.
        print("==========Skyend (Main Menu)==========")
        print("1) New Middleware")
        print("2) New Route")
        print("3) Quit")
        print("==========Skyend (Main Menu)==========")

        #Get user input.
        choice = input(">>> ")

        #Create new Middleware.
        if choice == "1":
            createMiddleware()
        
        #Create new Route.
        elif choice == "2":
            continue
        
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

    #Make sure the file_extension is .js
    file_extension = ".js"
    
    #Get the basename of the path witout the extension.
    basename = os.path.basename(filename)

    #Keep only the first string if there are dots in the name.
    basename = basename.split(".")[0]

    #Change the path to contain the filename + .middleware.
    path = filename + ".middleware"

    #Append the .js extention.
    path = path + file_extension

    #Create the actual path.
    actual_path = os.path.join("src", os.path.join("middleware", path))

    #Create the script file.
    try:

        #Create the directories first.
        os.makedirs(os.path.dirname(actual_path), exist_ok=True)

        with open(actual_path, "w") as file:
            file.write(middleware_template.replace("%name%", basename).replace("%order%", order))
        
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
