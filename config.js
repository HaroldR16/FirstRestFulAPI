require("dotenv").config();
module.exports = {
    "databases":[{
        "name":"MyDB",
        "server":process.env.MyDB_Server,
        "port": parseInt(process.env.MyDB_Port),
        "database": process.env.MyDB_DB,
        "user": process.env.MyDB_User,
        "password":process.env.MyDB_Password
    }]
}