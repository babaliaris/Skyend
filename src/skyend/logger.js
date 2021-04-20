const { WinstonRotatingFile } = require("winston-rotating-file");
const winston = require('winston');


class Logger
{
    /**
     * @type winston.Logger
     */
    logger = null;

    //Constructor.
    constructor()
    {

        //Create the winston logger object.
        this.logger = winston.createLogger(
        {
            level           : 'info',
            format          : winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json(), winston.format.prettyPrint()),
            defaultMeta     : { service: 'user-service' },
            transports      : [
                new WinstonRotatingFile({
                  filename  : "logger.log",
                  rfsOptions: {
                    size    : "50M", // rotate every 50 MegaBytes written
                    interval: "1d",  // rotate daily
                    compress: "gzip" // compress rotated files
                  }
                })
              ]
        });
    }


    /**
     * 
     * @param {*} err The error object.
     */
    error = (err)=>
    {
        //Get the stack.
        const stack = err.stack;

        //If there was ineed a stack property.
        if (stack)
        {
            this.logger.error({message: err.message, stack: stack});
        }

        //Stack property is not defined.
        else
        {
            this.logger.error({message: err.toString(), stack: ""});
        }


        //If we are in Dev Mode.
        if (process.env.NODE_ENV !== "production")
        {

            //If there was a stack string, print it.
            if (stack)
                console.log(stack);
            
            //Else print the err object as a string.
            else
                console.log(err.toString());
        }
    }
};


module.exports = new Logger();