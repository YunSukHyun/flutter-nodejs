const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const authenticate = (req, res, next) => {
  try {
    let token;
    console.log(req);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers['authorization'].split(' ')[1];
    }
    console.log(`token: ${token}`);
    if(!token){
      throw new Error('Unauthorized')
    }
    const decoded = jwt.verify(token, 'secret');
    console.log(decoded);
    if(decoded.id != 1){
      throw new Error('Unauthorized');
    }
    next();
  } catch (e) {
    res.status(401).json({
      success: false,
      message: e.message,
    })
  }
}

app.get('/login', (req, res) => {
  const token = jwt.sign({id:1}, 'secret');
  res.status(200).json({
    success: true,
    token,
  })
})

app.get('/dev', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'dev mode'
  })
})

app.get('/prod', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Prod mode'
  })
});

app.get('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found'
  })
})
app.listen(3010, ()=> {
  console.log('server up on 3010...');
})