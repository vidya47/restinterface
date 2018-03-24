var express = require('express');
var router = express.Router();

/* GET devices listing. */
router.get('/deviceList', function(req, res, next) {
  var db = req.db;
  var collection = db.get('deviceList');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});



//POST to addDevice.*/
router.post('/addDevice', function(req, res) {
    var db = req.db;
    var collection = db.get('deviceList');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});



//DELETE to deleteDevice.*/
router.delete('/deleteDevice/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('deviceList');
    var deviceToDelete = req.params.id;
      collection.remove({ '_id' : deviceToDelete }, function(err) {
          res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
