/**
 * Created db.js
 * Author: piaopiao
 * Date: 2018/5/24
 * Time: 13:16
 * Description:pool方式连接postgresql
*/
var pg = require('pg');

var config = {
    user:'postgres',
    database:'liaoning',
    password:'472594-piao',
    host:'localhost',
    port:'5432',
    max:200,
    idleTimeoutMillis:30000
};
var pool=new pg.Pool(config);

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack);
});

//export the query method for passing queries to the pool
module.exports.query = function (text, values, callback) {
    //console.log('query:', text, values);
    return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
    return pool.connect(callback);
};

