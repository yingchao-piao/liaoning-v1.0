var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/map');
});

/* Redirect map page. */
router.get('/map',function(req,res,next){
    res.sendFile(path.join(__dirname,'../public/pages','map.html'));
});
module.exports = router;
