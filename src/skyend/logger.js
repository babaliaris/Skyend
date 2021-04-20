const { WinstonRotatingFile }   = require("winston-rotating-file");
const winston                   = require('winston');
const util                      = require("util");
const dayjs                     = require("dayjs");
const Database                  = require("./database");


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
     * @description Logs an Error object to the logger.log file and to the t_skyend_logger table.
     * 
     * @param {Error} err The error object.
     * @returns {void}
     */
    error = (err)=>
    {
        //If err has stack and message properties.
        if (err.stack && err.message);

        //Do not accept a non Error object.
        else
        {
            //Represent the object structure as a string.
            const err_string = util.inspect(err, false, null, true);

            //Create a fake error.
            err = new Error("Not an Error Object ===> "+err_string);
        }

        //Log the error.
        this.logger.error({message: err.message, stack: err.stack});

        //If we are in Dev Mode.
        if (process.env.NODE_ENV !== "production")
            console.log(err.stack);
    }
};


module.exports = new Logger();