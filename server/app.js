const express = require('express');
const fs = require('fs');
const csv = require('csvtojson')
const dateFormat = require('dateformat');
const now = new Date();
const app = express();
var logObjects= {};
var log='';

app.use((req, res, next) => {
// write your logging code here
const timeStamp = dateFormat("yyyy-mm-dd'T'HH:MM:ss");
const agent = req.headers['user-agent'];

logObjects.Agent = (agent);
logObjects.Time = (timeStamp);
logObjects.Method = (req.method);
logObjects.Resource = (req.url);
logObjects.Version = ('HTTP/'+ req.httpVersion);
logObjects.Status = (res.statusCode);

log = logObjects.Agent +','+ logObjects.Time +','+ logObjects.Method +','+ logObjects.Resource +','+ logObjects.Version +','+ logObjects.Status + '\n';

console.log(log);
// 2007-06-09T17:46:21 
next();

fs.appendFile('log.csv', log, function (err) {
    if (err) throw err;
    console.log(log);
  });
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
res.send('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
        var logsArray = [];
            csv({
                noheader: false,
                headers: ['Agent','Time','Method','Resource','Version','Status']
            })
            .fromFile('log.csv')
            .on('json',(log)=>{
            logsArray.push(log);
            })
            .on('done',()=>{
                console.log('end');
                res.send(logsArray);
            })
    });

module.exports = app;
