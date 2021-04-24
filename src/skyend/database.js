const mysql                     = require("mysql");
const { WinstonRotatingFile }   = require("winston-rotating-file");
const winston                   = require('winston');
const e = require("express");


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




/**
 * @description A mysql Wrapper for easier usage.
 * @class
 */
class Database
{
    /**
     * @description Use this propertie to have access to the mysql.Connection.
     * @type mysql.Connection
     */
    conn = null;

    
    /**
     * @description Connect to the database using the environment variables.
     * @returns {Promise<mysql.Connection, mysql.MysqlError>}  Resolves the mysql.connection object.
     */
    connect = ()=>
    {
        return new Promise((resolve, reject)=>
        {

            //Development Database.
            if (process.env.NODE_ENV !== "production")
            {
                //Create the connection object.
                this.conn = mysql.createConnection({
                    database: process.env.TEST_DB_NAME,
                    user    : process.env.TEST_DB_USER,
                    password: process.env.TEST_DB_PASS,
                    host    : process.env.TEST_DB_HOST
                });
            }

            //Production Database.
            else
            {
                //Create the connection object.
                this.conn = mysql.createConnection({
                    database: process.env.DB_NAME,
                    user    : process.env.DB_USER,
                    password: process.env.DB_PASS,
                    host    : process.env.DB_HOST
                });
            }

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

                    //Reject this promise.
                    reject(err);
                }

                //Resolve this promise.
                else
                {
                    resolve(this.conn);
                }
            });
        });
    }



    /**
     * @description Disconnect from the database (Close the connection).
     * @returns {void}
     */
    disconnect = ()=>
    {
        //if this.conn is defined and not null.
        if (this.conn)
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
    }



    /**
     * @description Insert one row to a table. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} data  The data object. The properties of this obj must have THE SAME NAME as the columns in the table.
     * @returns {Promise<Object, mysql.MysqlError>}
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
            this.connect().then(()=>
            {
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
            }).catch((err)=>
            {
                reject(err);
            });

        });

    };




    /**
     * @description Update a single row. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} data  The data object. The properties of this obj must have THE SAME NAME as the columns in the table.
     * @param {object} where The where clause condition in key:value pair.
     * @returns {Promise<Object, mysql.MysqlError>}  Resolves the results object.
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
            this.connect().then(()=>
            {
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
            }).catch((err)=>
            {
                reject(err);
            });
            
        });

    };




    /**
     * @description Delete a single row. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} where The where clause condition in key:value pair.
     * @returns {Promise<Object, mysql.MysqlError>}  Resolves the results object.
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
            this.connect().then(()=>
            {
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
            }).catch((err)=>
            {
                reject(err);
            });
            
        });

    };




    /**
     * @description Get a single row. This method connects and disconnects automatically.
     * 
     * @param {string} table The name of the table.
     * @param {object} where The where clause condition in key:value pair.
     * @returns {Promise<Array, mysql.MysqlError>} Resolves the results object.
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
            this.connect().then(()=>
            {
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
            }).catch((err)=>
            {
                reject(err);
            });
            
        });

    };




    /**
     * @description Call a stored procedure. This method connects and disconnects automatically.
     * 
     * @param {string} procedure The name of the procedure.
     * @param {Array}  args The procedure call arguments.
     * @returns {Promise<Array | Object, mysql.MysqlError>} Resolves the results object.
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
            this.connect().then(()=>
            {
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
            }).catch((err)=>
            {
                reject(err);
            });
            
        });

    };



    

    /**
     * @description Execute a query. This method connects and disconnects automatically.
     * 
     * @param {string} query_string The query string. Example: SELECT * FROM users WHERE m_name = ?;
     * @param {Array}  values An array with all the values that will map to ? marks.
     * @returns {Promise<{results: Array | Object, fields: mysql.FieldInfo}, mysql.MysqlError>} Resolves the object {results: , fields: }
     */
    query = (query_string, values) =>
    {   
        //Create the Promise.
        return new Promise((resolve, reject)=>
        {
            //Connect to the database.
            this.connect().then(()=>
            {   
                //Execute the query.
                this.conn.query(query_string, values, (err, results, fields)=>
                {
                    //Query Error.
                    if (err)
                    {
                        reject(err);
                    }

                    //Resolve the Promise.
                    else
                    {
                        resolve({results: results, fields: fields});
                    }

                    //Disconnect from the database.
                    this.disconnect();
                });

            }).catch((err)=>
            {
                reject(err);
            })
        });
    };
     
}

module.exports = Database;