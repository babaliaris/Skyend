const mysql                     = require("mysql");
const { WinstonRotatingFile }   = require("winston-rotating-file");
const winston                   = require('winston');




//Create the winston logger object.
const logger = winston.createLogger(
{
    level           : 'info',
    format          : winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json()),
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




class Database
{
    /**
     * @type mysql.Connection
     */
    conn = null;

    
    /**
     * @description Connect to the database using the environment variables.
     * @returns {void}
     */
    connect = ()=>
    {
        //Create the connection object.
        this.conn = mysql.createConnection({
            database: process.env.DB_NAME,
            user    : process.env.DB_USER,
            password: process.env.DB_PASS,
            host    : process.env.DB_HOST
        });

        //Try to connect to the database.
        this.conn.connect((err)=>
        {   
            //Log the error.
            if (err)
            {
                logger.error({message: err.message, stack: err.stack});
                this.conn = null;
            }

        });
    }



    /**
     * @description Disconnect from the database (Close the connection).
     * @returns {void}
     */
    disconnect = ()=>
    {
        this.conn.end((err)=>
        {
            //Log the error.
            if (err)
                logger.error({message: err.message, stack: err.stack});

            this.conn = null;
        });
    }
}

module.exports = Database;