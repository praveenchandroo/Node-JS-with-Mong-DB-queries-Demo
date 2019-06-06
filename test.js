var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


var port = process.env.PORT || 3000;

// var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'pollutiondata'
// });



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://pchand34:*******@cluster0-bmiju.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
var dbo;
client.connect(function(err, db) {
  if (err)
  {
    //throw err
    client.close();
  }
  else
  {
   console.log('Connected to DB!');
   dbo = db.db("AQI_Data");
   //var query = db.restaurants.distinct( "cuisine" );
   dbo.collection("AQI").distinct("Year", function(err, result)
   {
    console.log(result);
   });
  }

});



// connection.connect(function(err) {
//   if (err) throw err
//   console.log('Connected to DB!');
// });

app.post('/api/get', function(req, res) {
    var year = parseInt(req.body.year);
    var state = req.body.state;
    var county = req.body.county;

    // query = " SELECT * FROM `table 1` WHERE Year="+year+" and State='"+state+"' and County='"+county+"' ";

        dbo.collection("AQI").findOne({$and : [{"Year" : year}, {"State" : state}, {"County" : county}]}, function(err, result)
        {
        if (err) throw err
	    	// var data = { "data" : results[0] } ;
			   res.header("Access-Control-Allow-Origin", "*");
		    res.send(result);
      });
});


app.post('/api/getoveryears', function(req, res) {
    var state = req.body.state;
    var county = req.body.county;
	console.log(state)
	console.log(county)
    // query = " SELECT * FROM `table 1` WHERE State='"+state+"' and County='"+county+"' ";

    // connection.query(query, function(err, results) {
 dbo.collection("AQI").find({$and : [{"State" : state}, {"County" : county}]}).toArray(function(err, result)
{
        if (err) throw err
	    	// var data = { "data" : results[0] } ;
			res.header("Access-Control-Allow-Origin", "*");
		    res.send(result);
      });
 });


  app.get('/api/getYear', function(req, res) {

             dbo.collection("AQI").distinct("Year", function(err, result)
              {
                  res.header("Access-Control-Allow-Origin", "*");
                  console.log(result);
                  res.send(result);
              });
        });





app.post('/api/getState', function(req, res) {
	   var Y = parseInt(req.body.Year);
     // var query = {"Year" : Y};
     console.log(Y);
     // console.log(query);
      dbo.collection("AQI").distinct("State", {"Year" : Y}, function(err, result)
      {
			res.header("Access-Control-Allow-Origin", "*");
        console.log(result);
		    res.send(result);
      });
  });


app.post('/api/getCounty', function(req, res) {
	var Y = parseInt(req.body.Year);
	var State = req.body.State;
	console.log(Y)
	console.log(State)
      dbo.collection("AQI").find({$and : [{"Year" : Y}, {"State" : State}]}, {"County" : 1}).toArray(function(err, result)
      {

	    	// var data = { "data" : results[0] } ;
			res.header("Access-Control-Allow-Origin", "*");
        console.log(result)
		    res.send(result);
      });
  });

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
