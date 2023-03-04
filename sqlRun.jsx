const fs = require("fs");
const mysql = require("mysql2");
const {    PORT,
    HOST,
    USER,
    PASSWORD,
    DATABASE} = require('./constants/constants.js')
let connection;
connection = mysql.createConnection({
    port: PORT,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: 'clover_db'
});

connection.connect(async function (err) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
    await runSQLFile('sql/create/db.sql');
    await runSQLFile('sql/create/boards.sql');
    await runSQLFile('sql/create/cards.sql');
});

const runSQLFile = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                console.error(`Error reading SQL file ${fileName}: ` + err.stack);
                reject(err);
            }
            connection.query(data, function (error, results, fields) {
                if (error) {
                    console.error(`Error executing SQL file ${fileName}: ` + error.stack);
                    reject(error);
                }
                console.log(`SQL file ${fileName} executed successfully`);
                resolve();
            });
        });
    });
};