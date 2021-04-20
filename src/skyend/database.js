const mysql                     = require("mysql");
const { WinstonRotatingFile }   = require("winston-rotating-file");
const winston                   = require('winston');


//Create the winston logger object.
const logger = winston.createLogger(
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
                //Log the error.
                logger.error({message: err.message, stack: err.stack});
                
                //If dev mode, print it to the console.
                if (process.env.NODE_ENV !== "production")
                    console.log(err.stack);

                //Set the conn member to null.
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
            {
                //Log the error.
                logger.error({message: err.message, stack: err.stack});
                
                //If dev mode, print it to the console.
                if (process.env.NODE_ENV !== "production")
                    console.log(err.stack);
            }

            //Set the conn member to null.
            this.conn = null;
        });
    }



    /**
     * @description Insert one row to a table. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} data  The data object. The properties of this obj must have THE SAME NAME as the columns in the table.
     * @returns {Promise}
     */
    post = (table, data)=>
    {
        return new Promise((resolve, reject)=>
        {
            //Some Variables//
            let columns = "";
            let markers = "";
            let values  = [];
            //Some Variables//

            //Create the column, markers and values.
            for (let key in data)
            {
                columns += key + ",";
                markers += "?" + ",";
                values.push(data[key]);
            }

            //Remove the last comma (,) from the columns and markers strings.
            columns = columns.slice(0, columns.lastIndexOf(","));
            markers = markers.slice(0, markers.lastIndexOf(","));

            //Create the query string.
            const query = `INSERT INTO ${table} (${columns}) VALUES (${markers});`;
            
            //Connect.
            this.connect();

            //EXECUTE THE QUERY.
            this.conn.query(query, values, (err, results)=>
            {   
                //An error has occured.
                if (err)
                    reject(err);

                //Query succeeded.
                else
                    resolve(results);
                
                //Disconnect.
                this.disconnect();
            });
        });

    };



    /**
     * @description Insert one row to a table. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} data  The data object. The properties of this obj must have THE SAME NAME as the columns in the table.
     * @returns {Promise}
     */
    post = (table, data)=>
    {
        return new Promise((resolve, reject)=>
        {
            //Some Variables//
            let columns = "";
            let markers = "";
            let values  = [];
            //Some Variables//

            //Create the column, markers and values.
            for (let key in data)
            {
                columns += key + ",";
                markers += "?" + ",";
                values.push(data[key]);
            }

            //Remove the last comma (,) from the columns and markers strings.
            columns = columns.slice(0, columns.lastIndexOf(","));
            markers = markers.slice(0, markers.lastIndexOf(","));

            //Create the query string.
            const query = `INSERT INTO ${table} (${columns}) VALUES (${markers});`;
            
            //Connect.
            this.connect();

            //EXECUTE THE QUERY.
            this.conn.query(query, values, (err, results)=>
            {   
                //An error has occured.
                if (err)
                    reject(err);

                //Query succeeded.
                else
                    resolve(results);
                
                //Disconnect.
                this.disconnect();
            });
        });

    };



    /**
     * @description Update a single row. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} data  The data object. The properties of this obj must have THE SAME NAME as the columns in the table.
     * @param {object} where The where clause condition in key:value pair.
     * @returns {Promise}
     */
    put = (table, data, where)=>
    {
        return new Promise((resolve, reject)=>
        {
            //Some Variables//
            let columns   = "";
            let where_cond= "";
            let values    = [];
            //Some Variables//

            //Create the column, markers and values.
            for (let key in data)
            {
                columns += key + "=?,";
                values.push(data[key]);
            }

            //Create the WHERE clause condition.
            let should_enter_once = 0;
            for (let key in where)
            {
                where_cond = key + "=?";
                values.push(where[key]);
                should_enter_once++;
            }

            //Invalid where object.
            if (should_enter_once !== 1)
            {
                const fake_error = new Error("Invalid WHERE object.");
                reject(fake_error);
                return;
            }

            //Remove the last comma (,) from the columns string.
            columns = columns.slice(0, columns.lastIndexOf(","));

            //Create the query string.
            const query = `UPDATE ${table} SET ${columns} WHERE ${where_cond};`;
            
            //Connect.
            this.connect();

            //EXECUTE THE QUERY.
            this.conn.query(query, values, (err, results)=>
            {   
                //An error has occured.
                if (err)
                    reject(err);

                //Query succeeded.
                else
                    resolve(results);
                
                //Disconnect.
                this.disconnect();
            });
            
        });

    };




    /**
     * @description Delete a single row. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} where The where clause condition in key:value pair.
     * @returns {Promise}
     */
    delete = (table, where)=>
    {
        return new Promise((resolve, reject)=>
        {
            //Some Variables//
            let where_cond= "";
            let values    = [];
            //Some Variables//

            //Create the WHERE clause condition.
            let should_enter_once = 0;
            for (let key in where)
            {
                where_cond = key + "=?";
                values.push(where[key]);
                should_enter_once++;
            }

            //Invalid where object.
            if (should_enter_once !== 1)
            {
                const fake_error = new Error("Invalid WHERE object.");
                reject(fake_error);
                return;
            }

            //Create the query string.
            const query = `DELETE FROM ${table} WHERE ${where_cond};`;
            
            //Connect.
            this.connect();

            //EXECUTE THE QUERY.
            this.conn.query(query, values, (err, results)=>
            {   
                //An error has occured.
                if (err)
                    reject(err);

                //Query succeeded.
                else
                    resolve(results);
                
                //Disconnect.
                this.disconnect();
            });
            
        });

    };




    /**
     * @description Get a single row. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} where The where clause condition in key:value pair.
     * @returns {Promise}
     */
    get = (table, where)=>
    {
        return new Promise((resolve, reject)=>
        {
            //Some Variables//
            let where_cond= "";
            let values    = [];
            //Some Variables//

            //Create the WHERE clause condition.
            let should_enter_once = 0;
            for (let key in where)
            {
                where_cond = key + "=?";
                values.push(where[key]);
                should_enter_once++;
            }

            //Invalid where object.
            if (should_enter_once !== 1)
            {
                const fake_error = new Error("Invalid WHERE object.");
                reject(fake_error);
                return;
            }

            //Create the query string.
            const query = `SELECT * FROM ${table} WHERE ${where_cond};`;
            
            //Connect.
            this.connect();

            //EXECUTE THE QUERY.
            this.conn.query(query, values, (err, results)=>
            {   
                //An error has occured.
                if (err)
                    reject(err);

                //Query succeeded.
                else
                    resolve(results);
                
                //Disconnect.
                this.disconnect();
            });
            
        });

    };




    /**
     * @description Call a stored procedure. This method connects and disconnects automatically.
     * 
     * @param {string} procedure The name of the procedure.
     * @param {Array}  args The procedure call arguments.
     * @returns {Promise}
     */
    call = (procedure, args)=>
    {
        return new Promise((resolve, reject)=>
        {
            //Create the markers string.
            let markers = "";

            //For each argument, create a ? marker.
            args.forEach((value)=>
            {
                markers += "?,";
            });

            //Remove the last comma (,) from the markers string.
            markers = markers.slice(0, markers.lastIndexOf(","));

            //Create the query string.
            const query = `CALL ${procedure}(${markers});`;
            
            //Connect.
            this.connect();

            //EXECUTE THE QUERY.
            this.conn.query(query, args, (err, results)=>
            {   
                //An error has occured.
                if (err)
                    reject(err);

                //Query succeeded.
                else
                    resolve(results);
                
                //Disconnect.
                this.disconnect();
            });
            
        });

    };
     
}

module.exports = Database;