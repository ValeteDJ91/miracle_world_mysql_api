const mysql = require('mysql');
const express = require('express');
const fs = require('fs');
const app = express()
const configt = fs.readFileSync('config.json', 'utf8')
const config = JSON.parse(configt)

if (!config.host || !config.user || !config.password) {
  console.log("No MYSQL identifiants found");
  process.exit(1)
}
const con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Mysql successfully connected!");

app.listen(config.port, () => {
  console.log(`MYSQL API listening on port ${config.port}`)
})

app.get('/', (req, res) => {
  res.json({"status_code":403,"status_text":"Forbidden: nothing to find here"});
  console.log("Responding with code 400")
})

app.get('/request', (req, res) => {
  if (!req.query.command) {
    res.json({"status_code":400,"status_text":"Bad request: no 'command' parameter entered"});
    console.log("Responding with code 400")
    return
  }
  console.log("Request for "+JSON.stringify(req.query.command))
  try {
    con.query(req.query.command, function (err, result, fields) {
      if (err) {
        res.json({"status_code":400,"status_text":"Bad request: 'command' parameter not valid"}) 
        console.log("Responding with code 400")
        return
      }
      res.json({"status_code":200,"status_text":"OK","response":JSON.parse(JSON.stringify(result))});
      console.log("Responding with code 200")
    });
  } catch (err) {
    res.json({"status_code":400,"status_text":"Bad request: 'command' parameter not valid"});
    console.log("Responding with code 400")
  }
})


});