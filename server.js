const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const port = 40000;
//WEB TOKENS
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const bcrypt = require('bcrypt');
//CORS TO ALLOW CROSS ACCESS
const cors = require('cors');
//SQL MODULE
const sql = require('mssql');
//CALLING MY CONFIG FILE
const config = require('./config');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setuawait(swaggerDocument));

//This thing is asyncrhonous
app.post('/api/runsp', function(req, res){
    var ev = req.body;
    execSql(req, res).then(function(a){
        console.log(a);
        res.send(a);
    });
})

async function execSql(req, res){
    let ev = req.body;
    let sql = ev.query;
    let connection = getConnectionString(ev.appname);
    const pool = new sql.ConnectionPool(connection);
    pool.on('error', err =>{
        console.log('SQL ERRORS', err);
        logger.log('info', `sql errors: ${err}`);
    });

    try {
        await pool.connect();
        let result = await pool.request().query(sqlquery);
        return {success: result};
    } catch (error) {
        console.log(error);
        return {err : error};
    }finally{
        pool.close();
    }
}

function getConnectionString(appname){
    let connection;
    for(let i = 0; i < config.databases.length; i++){
        if(config.databases[i].name == appname){
            return connection = config.databases[i];
        }
    }
}

app.use(bodyParser.json({limit:'500mb'}));
app.use(cors());

app.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
});

app.get('/api/hello', (req, res)=>{
    res.send({'greetings':'HOLA BUENAS TARDES'});
});

app.get('/api/name', (req, res)=>{
    res.send({'name':'Josue Reaza'});
});

app.listen(port,()=>{
    console.log(`RESTFUL AT (${port})`)
    logger.log('info',`Happening`)
});