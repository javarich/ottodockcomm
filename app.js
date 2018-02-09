const express = require('express')
const app = express()

const MASTER_POWER = "masterPower";
const DIRECTION = "direction";
const LEFT_WINCH = "leftWinch";
const RIGHT_WINCH = "rightWinch";
const MURRAY = "murray";

app.get('/api', (req, res) => res.send('Hello from MCP!'))

app.get('/api/controls', function(req, res){
	var controlName = req.query.control;
	var state = req.query.state;
	console.log('MCP control %o setting to ', controlName, state);
 	
 	// Plug In Control firing logic here
	// Right now simply echoing back state we got
 	res.send(controlName+': ' + state);
 	
});

app.use(express.static('public', {
  index: "index.html"
}))

app.listen(3000, () => console.log('OttoDock Comm listening on port 3000'))