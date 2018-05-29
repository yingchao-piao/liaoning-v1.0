/**
 * Created liaoningResource.js
 * Author: piaopiao
 * Date: 2018/5/24
 * Time: 13:29
 * Description:处理数据库查询等相关操作
*/
var express = require('express');
var router = express.Router();
var pool = require('./db');

// Get feature infomation from postgresql
router.post('/getfeatureinfo',function(req,res,next) {
    var search = req.body;

    //Get domain name for each field
    var field_domain = [];
    pool.query('SELECT field, domain_name FROM public.field_domain',
        function(err,result) {
            if (err) {
                res.send({status: err});
                return;
            }
            field_domain = result.rows;

            var sql = "";
            for(var key in search){
                for(var i = 0; i<field_domain.length; i++){
                    if(field_domain[i].field == key){
                        if(field_domain[i].domain_name != null) {
                            sql += 'SELECT field, domain_name FROM public.field_domain WHERE field = \'' + key + '\'; ';
                            sql += 'SELECT domain.' + field_domain[i].domain_name + '.descriptio, ' +
                                'domain.' + field_domain[i].domain_name + '.code ' +
                                'FROM domain.' + field_domain[i].domain_name + ' ' +
                                'WHERE domain.' + field_domain[i].domain_name + '.code = \'' + search[key] + '\'; ';
                        } else{
                            sql += 'SELECT field, domain_name FROM public.field_domain WHERE field = \'' + key + '\'; ';
                        }
                    }
                }
            }
            pool.query(sql, function (err, results) {
                if(err){
                    res.send({status: "Error in sql query!"});
                } else{
                    res.send(results.rows);
                }
            });

        });

});

module.exports = router;