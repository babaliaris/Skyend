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
     * @param {string} path The request path if the error comes from a request.
     * @returns {void}
     */
    error = (err, path)=>
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
        this.logger.error({message: err.message, stack: err.stack, latest_request: path});

        //If we are in Dev Mode.
        if (process.env.NODE_ENV !== "production")
        {
            console.log("\n\n");
            console.log(`Message        : ${err.message}`);
            console.log(`Stack          : ${err.stack}`);
            console.log(`Latest Request : ${path}`);
            console.log("\n\n");
        }
        
        //Create the database object.
        const db = new Database();

        //Create the log data.
        const log_data = {
            m_source            : "Skyend",
            m_level             : "error",
            m_message           : err.message,
            m_stack             : err.stack,
            m_latest_request    : path,
            m_timestamp         : dayjs(Date.now()).format("YYYY-MM-DD hh:mm:ss")
        };

        //Insert the log into the t_skyend_logger table.
        db.post("t_skyend_logger", log_data).then((results)=>
        {
        }).catch((err)=>
        {
            //Log the error.
            this.logger.error({message: err.message, stack: err.stack, latest_request: path});

            //If we are in Dev Mode.
            if (process.env.NODE_ENV !== "production")
            {
                console.log("\n\n");
                console.log(`Message        : ${err.message}`);
                console.log(`Stack          : ${err.stack}`);
                console.log(`Latest Request : ${path}`);
                console.log("\n\n");
            }
        });
    }
};


module.exports = new Logger();