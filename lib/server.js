'use strict';

const express = require('express');

const errorHandler = require('../errorHandler.js');

const app = express();

const PORT = process.env.PORT || 8080;

const schema = {
  name: 'string'
};

const valInput = (req, res, next) => {
  const {body} = req;
  const keys = Object.keys(schema);

  let hasKeys = keys.every(key => {
    console.log(body.hasOwnProperty(key));
    return body.hasOwnProperty(key);
  });

  if(hasKeys && Object.keys(body).length === keys.length) {
    console.log('has the same keys');
    next();
  } else {
    console.log('has different keys');
    next(new Error('You did not match the schema'));
  }

};

let db = [];

app.use(express.json());

// app.use( express.static('./'));

app.use( (req,res,next) => {
  console.log('LOG:', req.method, req.path);
  next();
});

app.get('/categories', (req,res,next) => {
  let count = db.length;
  let results = db;
  res.json({count,results});
});

app.get('/categories/:id', (req,res,next) => {
  let id = req.params.id;
  let record = db.filter((record) => record.id === parseInt(id));
  res.json(record[0]);
});


app.post('/categories', valInput, (req,res,next) => {
  let {name} = req.body;
  let record = {name};
  record.id = db.length + 1;
  db.push(record);
  res.json(record);
});

app.put('/categories/:id', (req,res,next) => {
  let id = req.params.id;
  let {name} = req.body;
  let updatedRecord = {id, name};
  db = db.map( (record) => record.id === parseInt(id) ? updatedRecord : record);
  res.json(updatedRecord);
});

app.delete('/categories/:id', (req,res,next) => {
  let id = req.params.id;
  db = db.filter( (record) => record.id !== parseInt(id) );
  console.log(`Deleted ${id} from db`);
  res.json({});
});

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
};

app.use(errorHandler);