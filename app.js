const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

const app = express();

// Init Nexmo
const nexmo = new Nexmo({
    apiKey: 'your api key goes here',
    apiSecret: 'your api secret key goes here'
  }, {debug: true});

//Template engine setup
app.set('view engine', 'html'); 
app.engine('html', ejs.renderFile);

//Public folder setup
app.use(express.static(__dirname + '/public'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//post
app.post('/', (req,res) => {
  
    const number = req.body.number;
    const text = req.body.text;

  nexmo.message.sendSms(
    '12016441670', number, text, { type: 'unicode' },
    (err, responseData) => {
      if(err) {
        console.log(err);
      } else {
       //console.dir(responseData);
       //Get data from response
       const data = {
           id: responseData.messages[0]['message-id'],
           number: responseData.messages[0]['to']
       }
       io.emit('smsStatus',data);
      }
    }
  );

});

//get
app.get('/', (req,res) => {
    res.render('index');
});

const port = 3000;
//start server
const server = app.listen(port, () => console.log(`Server start on port ${port}`));

//connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnected', ()=>{
        console.log('Disconnected');
    })
})
